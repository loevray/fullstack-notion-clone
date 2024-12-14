import Title from "../common/Title.js";
import Component from "../core/Component.js";

class DocumentPageHeader extends Component {
  constructor({ $target, props }) {
    super({ $target, props, tagName: "div" });
  }
  //
  renderChild() {
    this.wrapper.innerHTML = "";
    new Title({
      $target,
      props: {
        initialState: {
          title: "문서",
        },
      },
    });
  }
}
