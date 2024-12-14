import { getTag } from "./getTag.js";

const getDeepCopy = (value) => {
  //객체나 배열이 아니라면 그대로 반환한다.
  if (getTag(value) !== "Object" && !Array.isArray(value)) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((el) => getDeepCopy(el));
  }
  const newObj = {};
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      newObj[key] = getDeepCopy(value[key]);
    }
  }
  return newObj;
};

export default getDeepCopy;
