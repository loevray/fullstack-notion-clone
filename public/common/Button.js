import Component from "../core/Component.js";

export default class Button extends Component {
  constructor({ $target, props }) {
    super({ $target, props, tagName: "button" });
  }
  prepare() {
    this.wrapper.classList.add("button-component");
    if (this.state.attributes) {
      this.state.attributes.forEach((attribute) => {
        const { name, value } = attribute;
        if (name === "class") {
          //클래스는 여러개라면 배열로 넣어주세요. 한개는 알아서 배열처리됩니다.
          const values = Array.isArray(value) ? value : [value];
          values.forEach((className) => {
            this.wrapper.classList.add(className);
          });
        } else {
          this.wrapper.setAttribute(name, value);
        }
      });
    }
  }
  createTemplate() {
    return this.state.content;
  }
  setEvent() {
    this.addEvent("click", ".button-component", (e) => this.props.onClick(e));
  }
}
