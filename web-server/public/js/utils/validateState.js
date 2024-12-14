import { getTag } from "./getTag.js";
import { isEqualType } from "./isEqualType.js";

export const validateState = (initialState, nextState) => {
  const initialStateType = getTag(initialState);
  //객체만 하위 상태들 체크
  if (initialStateType === "Object") {
    for (const state in initialState) {
      const initialStateKeyType = getTag(initialState[state]);
      const nextStateKeyTyep = getTag(nextState[state]);
      //초기 상태(객체)들의 키타입과 다음 상태들의 키타입 비교
      if (initialStateKeyType !== nextStateKeyTyep) {
        throw new Error("초기상태와 다음상태의 타입이 다릅니다!");
      }
    }
    return nextState;
  }
  //배열...은 어떻게 처리하지?
  if (!isEqualType(initialState, nextState)) {
    throw new Error("초기상태와 다음상태의 타입이 다릅니다!");
  }
  return nextState;
};
