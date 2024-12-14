import Component from "../core/Component.js";

export default class ErrorPage extends Component {
  constructor({ $target }) {
    super({ $target, tagName: "div" });
  }
  createTemplate() {
    return "컴포넌트가 존재하지 않습니다!";
  }
}
