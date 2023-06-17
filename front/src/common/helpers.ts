import { AtomEffect } from 'recoil';

function groupBy<T>(getKey: (element: T) => string | number) {
  return function (array: T[]) {
    return array.reduce<Record<string | number, T[]>>((prev, next) => {
      const key = getKey(next);
      if (!(key in prev)) {
        prev[key] = [];
      }
      prev[key].push(next);
      return prev;
    }, {});
  };
}

const localStorageEffect: AtomEffect<any> = ({ setSelf, onSet, node }) => {
  const key = node.key;
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue, _, isReset) => {
    isReset ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(newValue));
  });
};

export { groupBy, localStorageEffect };
