import { isEqual } from "../isEqual.js";

let currentObserver = null;
let currentUnObserver = null;
const observers = {};

export const observe = (fn) => (currentObserver = fn);
export const unobserve = (fn) => (currentUnObserver = fn);
export const observable = (obj) => {
  //상태마다 돌면서 get,set 지정
  const stateKeys = Object.keys(obj);
  // documents, selectedDocument
  stateKeys.forEach((key) => {
    let _value = obj[key];
    if (observers[key] === undefined) {
      observers[key] = new Set();
    }
    Object.defineProperty(obj, key, {
      get() {
        if (currentObserver) {
          observers[key].add(currentObserver);
          currentObserver = null;
        }
        if (currentUnObserver) {
          observers[key].delete(currentUnObserver);
          currentUnObserver = null;
        }
        return _value;
      },
      set(value) {
        if (isEqual(_value, value)) {
          return;
        }
        _value = value;
        observers[key].forEach((component) => component.render());
      },
    });
  });
  return obj;
};
