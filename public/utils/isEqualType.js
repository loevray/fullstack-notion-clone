import { getTag } from "./getTag.js";

export const isEqualType = (value1, value2) => {
  return getTag(value1) === getTag(value2);
};
