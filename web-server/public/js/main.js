import App from "./App.js";
import documentsReducer from "./modules/documentsDuck.js";
import { createStore } from "./utils/myRedux/createStore.js";
import thunk from "./utils/myRedux/thunk.js";

const store = createStore(documentsReducer, thunk);
export { store };

const $root = document.getElementById("root");
new App({ $target: $root });
