import { isEqual } from "../utils/isEqual.js";
import { validateState } from "../utils/validateState.js";

export default class Component {
  state;
  props;

  constructor({ $target, tagName = null, props }) {
    this.$target = $target;
    this.wrapper = tagName ? document.createElement(tagName) : null;
    this.props = props;
    this.state = props?.initialState;
    this.wrapper && this.$target.appendChild(this.wrapper);
    this.setEvent();
    this.prepare();
    this.render();
  }

  render() {
    if (this.wrapper) {
      const content = this.createTemplate();
      this.wrapper.innerHTML = content;
    }
    this.renderChild();
  }

  createTemplate() {
    return "";
  }

  setEvent() {
    this.addEvent();
  }

  addEvent(eventType, selector, callback) {
    if (!this.wrapper) {
      return;
    }
    this.wrapper.addEventListener(eventType, (e) => {
      if (!e.target.closest(selector)) return false;
      callback(e);
    });
  }

  prepare() {}

  renderChild() {}

  setState(nextState) {
    const prevState = this.state;
    if (!isEqual(prevState, nextState)) {
      this.state = validateState(this.state, nextState);
      this.render();
    }
  }
}
