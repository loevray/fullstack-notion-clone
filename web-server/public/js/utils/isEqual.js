import { getTag } from "./getTag.js";

export const isEqual = (value1, value2) => {
  const OBJ_TAG = "Object";
  const ARR_TAG = "Array";
  const value1Type = getTag(value1);
  const value2Type = getTag(value2);
  if (value1Type !== value2Type) {
    return false;
  }
  if (value1Type !== OBJ_TAG && value1Type !== ARR_TAG) {
    return value1 === value2;
  }
  if (value1Type === OBJ_TAG) {
    const value1Keys = Object.keys(value1);
    const value2Keys = Object.keys(value2);
    if (value1Keys.length !== value2Keys.length) {
      return false;
    }
    const longObj = value1Keys.length >= value2Keys.length ? value1 : value2;
    for (const key in longObj) {
      if (!isEqual(value1[key], value2[key])) {
        return false;
      }
    }
  } else if (value1Type === ARR_TAG) {
    if (value1.length !== value2.length) {
      return false;
    }
    for (let i = 0; i < value1.length; i++) {
      if (!isEqual(value1[i], value2[i])) {
        return false;
      }
    }
  }
  return true;
};
