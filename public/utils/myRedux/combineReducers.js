import getDeepCopy from "../getDeepCopy.js";

export const combineReducers = (reducers) => {
  //리듀서들은 객체에 하나씩 담겨 온다.
  const reducerKeys = Object.keys(reducers);
  //state들의 key는 리듀서 이름으로 된다.
  const combinatedReducer = (state = {}, action) => {
    const nextState = {};
    reducerKeys.forEach((reducerName) => {
      const reducer = reducers[reducerName];
      const prevStateOfReducer = state[reducerName];
      const nextStateOfReducer = reducer(prevStateOfReducer, action);
      nextState[reducerName] = getDeepCopy(nextStateOfReducer);
    });
    return nextState;
  };
  return combinatedReducer;
};
