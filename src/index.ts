import { v4 } from 'uuid';
import * as localForage from 'localforage';
import { Subject } from 'rxjs';

export default class RTStorage {
  private _storage: any;
  private _localStorage: any;
  private _observable: any;
  private _name: string;
  private _id: string;
  private _storageChangedEventKey: string;
  private _tabSyncHandler: any;
  private _ready: boolean;

  constructor({ name, ...option }) {
    this._name = name;
    this._id = v4();
    localForage.config({ name: this._name, ...option });
    this._storage = localForage.createInstance({
      name: this._name,
    });
    this._localStorage = localStorage;
    this._storageChangedEventKey = `${this._name}_storage_changed`;
    this._observable = new Subject();

    this._tabSyncHandler = async (event) => {
      if (
        event.key !== null &&
        typeof event.key !== 'undefined' &&
        event.key === this._storageChangedEventKey
      ) {
        try {
          const { setter, key } = JSON.parse(event.newValue);
          if (!setter || setter === this.id) {
            return;
          }
          const value = await this.getItem(key);
          this._observable.next({ key, value });
        } catch (e) {
          /* ignore error */
        }
      }
    };
    window.addEventListener('storage', this._tabSyncHandler);
  }

  async setItem(key, value) {
    await this.waitForReady();
    await this._storage.setItem(
      key,
      { value, setter: this.id },
    );
    this._observable.next({ key, value });
    this._updateStorageChangeKey(key);
  }

  async getItem(key) {
    await this.waitForReady();
    const originalData = await this._storage.getItem(key);
    try {
      const { value } = originalData;
      return value;
    } catch (error) {
      return undefined;
    }
  }

  async removeItem(key) {
    await this.waitForReady();
    await this._storage.removeItem(key);
    this._observable.next({ key, value: undefined });
    this._updateStorageChangeKey(key);
  }

  async keys() {
    await this.waitForReady();
    const keys = await this._storage.keys();
    return keys;
  }

  _updateStorageChangeKey(key) {
    this._localStorage.setItem(
      this._storageChangedEventKey,
      JSON.stringify({
        timestamp: Date.now(),
        key,
        setter: this.id,
      })
    );
  }

  get id() {
    return this._id;
  }

  async waitForReady() {
    if (this._ready) {
      return;
    }
    if (typeof this._storage.ready === 'function') {
      await this._storage.ready();
    }
    this._ready = true;
  }

  get $() {
    return this._observable;
  }

  subscribe(keyOrFunc: Function|string, func?: Function) {
    if (typeof keyOrFunc === 'function') {
      return this._observable.subscribe(keyOrFunc);
    }
    return this._observable.subscribe((e) => {
      if (e.key === keyOrFunc) {
        func(e.value);
      }
    });
  }

  destory() {
    if (this._tabSyncHandler) {
      window.removeEventListener('storage', this._tabSyncHandler);
    }
  }
}
