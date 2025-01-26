import App from "./App.js";
import documentsReducer from "./modules/documentsDuck.js";
import { combineReducers } from "./utils/myRedux/combineReducers.js";
import { createStore } from "./utils/myRedux/createStore.js";
import thunk from "./utils/myRedux/thunk.js";

const rootReducer = combineReducers({
  documentsReducer,
});

const store = createStore(rootReducer, thunk);
export { store };

const $root = document.getElementById("root");
new App({ $target: $root });
