import getDeepCopy from "../getDeepCopy.js";
import { getTag } from "../getTag.js";
import { observable, observe } from "../observer/Observe.js";

export const createStore = (reducer, middleware) => {
  const state = observable(reducer(undefined, undefined));

  const getState = () => Object.freeze(state);

  const dispatch = (action) => {
    if (getTag(action).includes("Function")) {
      return middleware({ dispatch, getState })(dispatch)(action);
    }
    const nextState = reducer(getDeepCopy(state), action);
    const stateKeys = Object.keys(state);
    stateKeys.forEach((stateKey) => {
      state[stateKey] = nextState[stateKey];
    });
  };

  const useSelector = (selector) => {
    const selectedState = selector(getState());
    return selectedState;
  };
  return { dispatch, getState, useSelector };
};
