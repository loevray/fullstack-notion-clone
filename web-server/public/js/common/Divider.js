import Component from "../core/Component.js";

export default class Divider extends Component {
  constructor({ $target, props }) {
    super({ $target, props, tagName: "a" });
  }
  prepare() {
    this.wrapper.classList.add("divider");
  }
  // state = {  title,  href}
  setState(nextState) {
    this.state = nextState;
    this.render();
  }
  setEvent() {
    this.addEvent("click", ".title", (e) => {
      e.preventDefault();
      this.props.onClick && this.props.onClick();
    });
  }
}
