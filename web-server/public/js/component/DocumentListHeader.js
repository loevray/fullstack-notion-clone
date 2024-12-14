import Component from "../core/Component.js";
import notionIcon from "../svg/notionIcon.js";

export default class DocumentListHeader extends Component {
  constructor({ $target }) {
    super({ $target, tagName: "header" });
  }
  prepare() {
    this.wrapper.classList.add("document-list-header");
  }
  createTemplate() {
    return `
    ${notionIcon}
    <span>김영현의 노션</span>
    `;
  }
}
