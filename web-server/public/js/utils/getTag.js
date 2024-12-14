export const getTag = (value) => {
  if (value == null) {
    return value === undefined ? "Undefined" : "Null";
  }
  return Object.prototype.toString.call(value).slice(8, -1);
};
