export default function Storage(storage) {
  this.storage = storage;
  this.getItem = (key, defaultValue) => {
    try {
      const storedValue = this.storage.getItem(key);
      if (storedValue !== null) {
        return JSON.parse(storedValue);
      }
      return defaultValue;
    } catch (e) {
      console.log(`아이템 꺼내는 중 오류발생 : ${e}`);
    }
  };
  this.setItem = (key, value) => {
    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log(`아이템 넣는 중 오류발생: ${e}`);
    }
  };
  this.removeItem = (key) => {
    try {
      this.storage.removeItem(key);
    } catch (e) {
      console.log(`아이템 제거중 오류발생: ${e}`);
    }
  };
}
