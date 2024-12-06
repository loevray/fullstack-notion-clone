import Editor from "../component/Editor.js";
import Title from "../common/Title.js";
import { getPathData } from "../utils/getPathData.js";
import { store } from "../main.js";
import {
  fetchCurrentDocumentAsync,
  updateDocumentAsync,
} from "../modules/documentsDuck.js";
import Component from "../core/Component.js";
import { observe, unobserve } from "../utils/observer/Observe.js";
import { push } from "../utils/handleRouteEvent.js";
import { debounce } from "../utils/debounce.js";
import { highlightSelectedDocument } from "../utils/highlightSelectedDocument.js";

// initialState : {doucmentId :null, document:null}
export default class MainPage extends Component {
  documentAutoSave = debounce((documentData) =>
    store.dispatch(updateDocumentAsync(documentData))
  );

  constructor({ $target, props }) {
    super({ $target, props, tagName: "div" });
  }

  prepare() {
    this.wrapper.classList.add("main-page");
    const [, documentId = pathData] = getPathData();
    this.documentId = documentId;
    this.getCurrentDocument();
    observe(this);
  }

  getCurrentDocument() {
    store.dispatch(fetchCurrentDocumentAsync(this.documentId));
  }

  render() {
    const data = store.useSelector(
      (state) => state.documentsReducer.selectedDocument
    );

    this.wrapper.innerHTML = "";

    const { id, title, content, path } = data;

    if (!id) return;

    path?.forEach(
      ({ id: parentId, title }) =>
        new Title({
          $target: this.wrapper,
          props: {
            initialState: {
              href: `documents/${parentId}`,
              title,
            },
            onClick: () =>
              push(`/documents/${parentId}`, highlightSelectedDocument),
          },
        })
    );

    new Editor({
      $target: this.wrapper,
      props: {
        initialState: {
          id,
          title,
          content,
        },
        documentAutoSave: this.documentAutoSave,
      },
    });

    this.renderChild();
  }

  unmount() {
    unobserve(this);
    if (!this.wrapper.parentNode) {
      return;
    }
    this.$target.removeChild(this.wrapper);
    this.documentAutoSave.stop();
  }
}
