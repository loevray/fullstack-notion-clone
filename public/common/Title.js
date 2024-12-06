import Component from "../core/Component.js";

export default class Title extends Component {
  constructor({ $target, props }) {
    super({ $target, props, tagName: "a" });
  }
  prepare() {
    if (this.state.href) {
      this.wrapper.setAttribute("href", this.state.href);
    }
    this.wrapper.classList.add("title");
  }
  // state = {  title,  href}
  createTemplate() {
    return this.state.title;
  }
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
