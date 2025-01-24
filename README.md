# 노션클론 프로젝트

## 개요

이 프로젝트는 노션을 풀스택으로 클론코딩하는 프로젝트입니다.
프론트엔드, 백엔드 모두 순수한 JavaScript로 진행됩니다!

## 백엔드

백엔드는 **Node.js**를 이용하여 **계층형 패턴(Layered architecture)**을 적용해 구축합니다.
스택은 다음과 같습니다.

- node.js
- mongodb

## API 엔드포인트와 응답 구조

### DocumentsType(문서 목록)

```ts
type DocumentsType = {
  id: number;
  title: string;
  documents: DocumentsType[] | [];
};
```

### DocumentType(단일 문서)

```ts
type DocumentType = {
  id: number;
  title: string;
  content: string;
  createdAt: string; //YYYY-MM-DD-HH:MM:SS
  updatedAt: string; //YYYY-MM-DD-HH:MM:SS
};
```

### API 세부사항

#### 1. 문서 목록

- **엔드포인트**: `/documents`
- **메서드**: GET
- **응답**: `DocumentsType[]`

#### 2. 문서 생성

- **엔드포인트**: `/documents`
- **메서드**: POST
- **파라미터**:
  ```json
  {
    "title": "문서 제목",
    "parent": "상위 문서의 id(number)"
  }
  ```
  - `parent`가 제공되지 않거나 `null`일 경우, **루트 디렉토리**에 문서를 생성합니다.
- **응답**: `DocumentType` (생성된 문서)

#### 3. 문서 삭제

- **엔드포인트**: `/documents/${documentId}`
- **메서드**: DELETE
- **동작**:
  - 삭제된 문서의 **하위 문서**는 삭제된 문서의 부모 문서를 새로운 부모로 설정합니다.
- **응답**: 삭제된 문서의 id

#### 4. 문서 수정

- **엔드포인트**: `/documents/${documentId}`
- **메서드**: PATCH
- **파라미터**:
  ```json
  {
    "title": "문서 제목",
    "content": "문서 내용"
  }
  ```
- **응답**: `DocumentType`

#### 5. 문서 상세

- **엔드포인트**: `/documents/${documentId}`
- **메서드**: GET
- **응답**: `DocumentType`

## 에러 코드와 상황별 설명

### 에러 타입 정의

```ts
interface CustomError extends Error {
  name: string; // CustomError클래스의 이름
  message: string;
  stack: function; //에러스택(비표준이지만 Error클래스에 정의되어있음)
  code: string; //사용자 정의 에러코드
}
```

### 1. 문서 목록 API (`/documents` - GET)

- **200 OK**: 문서 목록을 성공적으로 조회함. (문서목록이 존재하지 않을때도 성공)
- **500 Internal Server Error**: 서버 기타 오류 발생.

### 2. 문서 생성 API (`/documents` - POST)

- **201 Created**: 문서가 성공적으로 생성됨.
- **400 Bad Request**:
  - `title`이 없거나 유효하지 않음.
  - `parent`가 없거나 유효하지 않음.
- **500 Internal Server Error**: 서버 기타 오류 발생.

### 3. 문서 삭제 API (`/documents/${documentId}` - DELETE)

- **200 OK**: 문서와 관련된 동작이 성공적으로 처리됨.
  - 하위 문서가 삭제된 문서의 부모 문서를 새로운 부모로 설정.
- **404 Not Found**: 삭제하려는 문서를 찾을 수 없음.
- **500 Internal Server Error**: 서버 기타 오류 발생.

### 4. 문서 수정 API (`/documents/${documentId}` - PUT)

- **200 OK**: 문서가 성공적으로 수정됨.
- **400 Bad Request**:
  - `title`의 길이가 **20자**를 초과함
- **404 Not Found**: 수정하려는 문서를 찾을 수 없음.
- **500 Internal Server Error**: 서버 기타 오류 발생.

### 5. 문서 상세 API (`/documents/${documentId}` - GET)

- **200 OK**: 요청한 문서의 상세 정보를 성공적으로 조회함.
- **404 Not Found**: 요청한 문서를 찾을 수 없음.
- **500 Internal Server Error**: 서버 기타 오류 발생.

### 에러 예시

```json
{
  "name": "CustomError",
  "status": 400,
  "stack": "...",
  "error": "Bad Request",
  "message": "유효하지 않은 상위 문서 ID."
}
```

## 테스트

```
npm run test:unit //유닛테스트
npm run test:integration //통합테스트
```

---

## 프론트엔드

## 상태기반 렌더링

상태값이 변경되면 리렌더링을 일으키는 매커니즘을 적용하였습니다.

```js
//web-server/public/js/core/Component.js

export default class Component {
  //...some logics
  render() {
    ...
  }

  setState(nextState) {
    const prevState = this.state;
    if (!isEqual(prevState, nextState)) {
      this.state = validateState(this.state, nextState);
      this.render();
    }
  }
}
```

값의 비교, 검증 로직 또한 라이브러리 없이 진행하였습니다.

## 전역 상태관리

`Redux`의 패턴을 유사하게 구현하여 전역상태를 관리하였습니다.

`dispatch => action => store(reducer) => view`

```js
//web-server/public/js/utils/myRedux/createStore.js

export const createStore = (reducer, middleware) => {
  const state = {
    [reducer.name]: observable(reducer(undefined, undefined)),
  };

  const subscribe = (callback) => {
    //아직 구현되지 않음
  };

  const getState = () => Object.freeze(state);

  const dispatch = (action) => {
    if (getTag(action).includes("Function")) {
      return middleware({ dispatch, getState })(dispatch)(action);
    }

    const nextState = reducer(getDeepCopy(state[reducer.name]), action);
    const stateKeys = Object.keys(state[reducer.name]);
    stateKeys.forEach((key) => {
      state[reducer.name][key] = nextState[key];
    });
  };

  const useSelector = (selector) => {
    const selectedState = selector(getState());
    return selectedState;
  };

  return { subscribe, dispatch, getState, useSelector };
};
```

## 클라이언트 라우팅

`customEvent`와 `popstate`이벤트, `history`를 이용하여 클라이언트측 라우팅을 구현하였습니다.

```js
//web-server/public/js/utils/handleRouteEvent.js

const ROUTE_CHANGE_EVENT = "route-change";

export const initRouter = (onRoute) => {
  window.addEventListener(ROUTE_CHANGE_EVENT, (e) => {
    const { nextUrl, callback } = e.detail;
    if (nextUrl) {
      history.pushState(null, null, nextUrl);
      callback?.();
      onRoute();
    }
  });

  window.addEventListener("popstate", () => onRoute());
  window.addEventListener("DOMContentLoaded", () => onRoute());
};

export const push = (nextUrl, callback) => {
  window.dispatchEvent(
    new CustomEvent("route-change", {
      detail: {
        nextUrl,
        callback,
      },
    })
  );
};

export const usePopStateEvent = (callback) => {
  window.addEventListener("popstate", () => callback());
};
```

---

## 프로젝트 관련 글

[프로젝트 리팩토링 글](https://velog.io/@loevray/series/%EB%85%B8%EC%85%98%ED%81%B4%EB%A1%A0-%EB%A6%AC%ED%8C%A9%ED%86%A0%EB%A7%81%EA%B8%B0)
