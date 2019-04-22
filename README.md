# rt-storage

A real time storage library based on localforage and rxjs.

## Install

via npm:

```
npm install rt-storage
```

via yarn:

```
yarn add rt-storage
```

## Use

With Webpack:

```js
import RTStorage from 'rt-storage';

const storage = new RTStorage({ name: 'test-db' });
storage.subscribe((event) => {
  console.dir(event)
});
```

With CDN:

```html
<script src="https://unpkg.com/localforage@1.7.3/dist/localforage.js"></script>
<script src="https://unpkg.com/rxjs@6.4.0/bundles/rxjs.umd.min.js"></script>
<script src="https://wzrd.in/standalone/uuid%2Fv4@latest"></script>
<script src="https://unpkg.com/rt-storage@0.0.1/build/index.js"></script>
<script>
var storage = new RTStorage({ name: 'test-db' });
storage.subscribe((event) => {
  console.dir(event)
});
</script>
```

## API

### getItem

Get data from storage:

```js
storage.getItem(storageKey)
```

Return promise

### setItem

Set data into storage:

```js
storage.setItem(storageKey, data)
```

Return promise.

### subscribe

Subscribe storage data changed event:

```js
const subscription = storage.subscribe((event) => console.dir(event));
// subscription.unsubscribe
storage.subscribe('storageKey', (data) => console.dir(data));
```
