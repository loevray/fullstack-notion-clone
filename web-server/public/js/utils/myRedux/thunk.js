import { getTag } from "../getTag.js";

const thunk =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    //AsyncFunction태그도 검사해야해서 includes사용.
    if (getTag(action).includes("Function")) {
      return action(dispatch, getState);
    }
    return next(action);
  };

export default thunk;

/* 
  thunk미들웨어는 디스패치 메서드를 함수에 인수로 보낸다.
*/
