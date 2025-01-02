import { request } from "../utils/api.js";
import getDeepCopy from "../utils/getDeepCopy.js";
import { push } from "../utils/handleRouteEvent.js";
const FETCH_DOCUMENTS = "documents/FETCH_DOCUMENTS";
const FETCH_CURRENT_DOCUMENT = "documents/FETCH_CURRENT_DOCUMENT";
const UPDATE_DOCUMENT = "documents/UPDATE_DOCUMENT";
const CREATE_DOCUMENT = "documents/CREATE_DOCUMENT";
const REMOVE_DOCUMENT = "documents/REMOVE_DOCUMENT";

export const createDocumentAsync =
  (parentId = null) =>
  async (dispatch) => {
    try {
      const body = { title: "제목 없음", parent: parentId };
      const createdDocument = await request("/documents", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!createdDocument) {
        throw new Error("문서 생성되지 않음");
      }

      dispatch({
        type: CREATE_DOCUMENT,
        payload: createdDocument,
      });

      dispatch(fetchDocumentsAsync());
    } catch (e) {
      console.error(e);
    }
  };

const checkSelectedDocument = (removedId, selectedId) => {
  if (removedId === selectedId) return true;
  return false;
};

export const removeDocumentASync = (documentId) => async (dispatch) => {
  try {
    if (!documentId) {
      return alert("삭제하려는 문서 아이디를 지정해주세요");
    }

    await request(`/documents/${documentId}`, {
      method: "DELETE",
    });

    dispatch({
      type: REMOVE_DOCUMENT,
      payload: documentId,
    });

    dispatch(fetchDocumentsAsync());

    // 문서 삭제 후 홈으로 이동?
  } catch (e) {
    console.error(e);
  }
};

const fetchDocuments = async (dispatch) => {
  const documents = await request("/documents");
  // [{id:number, title:string, documents:array, createAt:string, updatedAt:string}]
  dispatch({
    type: FETCH_DOCUMENTS,
    payload: documents,
  });
};

export const fetchDocumentsAsync = () => async (dispatch) => {
  try {
    fetchDocuments(dispatch);
  } catch (e) {
    console.log(e);
  }
};

const getSelectedDocumentPath = (documents, currentId) => {
  let temp = [];
  const getPath = (document, parent) => {
    if (currentId === document.id) {
      temp.push(...parent);
      return;
    }
    if (document?.documents?.length) {
      document.documents.forEach((doc) => getPath(doc, [...parent, document]));
    }
  };
  documents.forEach((doc) => getPath(doc, []));
  return temp;
};

export const fetchCurrentDocumentAsync =
  (documentId) => async (dispatch, getState) => {
    try {
      const selectedDocument = await request(`/documents/${documentId}`);
      dispatch({
        type: FETCH_CURRENT_DOCUMENT,
        payload: {
          ...selectedDocument,
          path: getSelectedDocumentPath(
            getState().documentsReducer.documents,
            selectedDocument.id
          ),
        },
      });
    } catch (e) {
      console.log(e);
      alert("존재하지 않는 문서군요?");
    }
  };

export const updateDocumentAsync = (documentData) => async (dispatch) => {
  try {
    const { id, title, content } = documentData;
    const requestBody = {
      title: title || "제목 없음",
      content,
    };

    const updateDocument = await request(`/documents/${id}`, {
      method: "PUT",
      body: JSON.stringify(requestBody),
    });

    dispatch({
      type: UPDATE_DOCUMENT,
      payload: {
        title: updateDocument.title,
        content: updateDocument.content,
      },
    });

    fetchDocuments(dispatch);
  } catch (e) {
    console.log(e);
  }
};

const initialState = {
  documents: [],
  selectedDocument: {},
};

export default function documentsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_DOCUMENTS: {
      return { ...state, documents: action.payload };
    }
    case FETCH_CURRENT_DOCUMENT: {
      return {
        ...state,
        selectedDocument: action.payload,
      };
    }
    case UPDATE_DOCUMENT: {
      return {
        ...state,
        selectedDocument: {
          ...getDeepCopy(state.selectedDocument),
          title: action.payload.title,
          content: action.payload.content,
        },
      };
    }
    case CREATE_DOCUMENT: {
      return {
        ...state,
        selectedDocument: action.payload,
      };
    }
    case REMOVE_DOCUMENT: {
      const selectedDocument = checkSelectedDocument(
        action.payload,
        state.selectedDocument?.id
      )
        ? {}
        : state.selectedDocument;
      return {
        ...state,
        selectedDocument,
      };
    }
    default:
      return state;
  }
}
