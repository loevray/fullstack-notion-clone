import Title from "../common/Title.js";
import { paddingCoefficient } from "../constants/paddingCoefficient.js";
import Component from "../core/Component.js";

export default class NoSubDocument extends Component {
  constructor({ $target, props }) {
    super({ $target, props, tagName: "div" });
  }
  prepare() {
    this.wrapper.classList.add(
      "no-sub-document",
      "document-children",
      "display-none"
    );
    this.wrapper.style.paddingLeft = `${
      this.state.depth * paddingCoefficient + 24 //왼쪽 화살표버튼크기 + 기본패딩값 더해줘야함
    }px`;
  }
  renderChild() {
    new Title({
      $target: this.wrapper,
      props: {
        initialState: {
          title: "하위문서 없음",
        },
      },
    });
  }
}
