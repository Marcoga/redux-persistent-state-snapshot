const shallowEqual = (propA, propB) => 
  Object.keys(propA)
    .filter(key => propA[key] !== propB[key]).length === 0

const defaultConfig = {
  selector: state => state,
  mountAt: 'redux-state-snapshot',
  serialize: JSON.stringify,
  shouldUpdate: (currentSnapshot, lastSnapshot) => !shallowEqual(currentSnapshot, lastSnapshot),
  persist: (mountAt, serialized) => localStorage.setItem(mountAt, serialized)
}

export default function createPersistentStateSnapshot(config) {
  
  const finalConfig = {
    ...defaultConfig,
    ...config
  }

  const {
    selector,
    serialize,
    mountAt,
    shouldUpdate,
    persist
  } = finalConfig;

  let lastSnapshot = {};

  return ({ getState }) => next => action => {
    let result = next(action);

    let newSnapshot = selector(getState());
    
    if(shouldUpdate(newSnapshot, lastSnapshot)) {
      lastSnapshot = newSnapshot;
      persist(mountAt, serialize(lastSnapshot))
    }

    return result;
  }
}
