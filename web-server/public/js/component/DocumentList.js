import Component from "../core/Component.js";
import { usePopStateEvent } from "../utils/handleRouteEvent.js";
import { highlightSelectedDocument } from "../utils/highlightSelectedDocument.js";
import DocumentItem from "./DocumentItem.js";

export default class DocumentList extends Component {
  constructor({ $target, props }) {
    super({ $target, tagName: "div", props });
    highlightSelectedDocument();
    usePopStateEvent(highlightSelectedDocument);
  }

  prepare() {
    this.wrapper.classList.add("document-list");
    const { depth } = this.props;
    if (depth > 0) {
      this.wrapper.classList.add("document-children");
    }
  }

  renderChild() {
    const { depth } = this.props;
    this.state.forEach((document) => {
      new DocumentItem({
        $target: this.wrapper,
        props: {
          initialState: document,
          depth: depth + 1,
        },
      });
    });
  }
}
