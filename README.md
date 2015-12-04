Redux Persistent State Snapshot
====
[Middleware](http://rackt.github.io/redux/docs/advanced/Middleware.html) to persist your state in a Redux app.

```js
npm install --save redux-persistent-state-snapshot
```
# Motivation
Persist a part (for example your UI State) of your State tree.

# Usage
```js
import createPersistentStateSnapshot from 'redux-persistent-state-snapshot';

const reduxStateSnapshot = 'reduxStateSnapshot';

const persistentStateSnaphot = createPersistentStateSnapshot({
  //key where your state will be mounted
  mountAt: reduxStateSnapshot,
  //select the state you want to persist
  selector: state => ({
    orderBy: state.orderBy,
    filters: state.filters
  })
});

//apply the middleware
const finalCreateStore = compose(
  applyMiddleware(thunk, persistentStateSnaphot),
)(createStore);

export default function configureStore(initialState = {}) {
  //the default serialization is JSON.stringify --> so use JSON.parse to deserialize
  const stateSnapshot = JSON.parse(
    //the default persistent storage is localStorage
    localStorage
      .getItem(reduxStateSnapshot)
  );

  const finalInitialState = {
    ...initialState,
    ...stateSnapshot
  };

  //one way to inject your saved Data when the application is mounted is to pass it as the initialState to the store
  const store = finalCreateStore(rootReducer, finalInitialState);

  //but you could also create an action on the root component on componentWillMount...


  return store;
}
```
