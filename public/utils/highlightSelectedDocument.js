export const highlightSelectedDocument = () => {
  const documentList = document.querySelectorAll(".document-item-inner");
  const { pathname } = window.location;
  const [, , pathdata] = pathname.split("/");
  documentList.forEach((node) => {
    if (node.parentNode.dataset.id === pathdata) {
      node.classList.add("selected-document");
    } else {
      node.classList.remove("selected-document");
    }
  });
};
