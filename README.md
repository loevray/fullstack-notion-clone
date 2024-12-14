# 노션클론 포트폴리오 서버를 위한 백엔드!

## 개요

이 백엔드 서버는 문서를 관리하며, 문서에 대한 CRUD 작업을 지원합니다. Node.js로 작성되었으며 RESTful API 원칙을 따릅니다.

## API 엔드포인트와 응답 구조

### DocumentsType 구조

```json
{
  "id": number,
  "title": string,
  "documents": DocumentsType[],
}
```

### DocumentType 구조

```json
{
  "id": number,
  "title": string,
  "content":string,
  "createdAt": string,
  "updatedAt": string
}
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
    "parent": "상위 문서 ID (number)"
  }
  ```
  - `parent`가 제공되지 않거나 `null`일 경우, **루트 디렉토리**에 문서를 생성합니다.

#### 3. 문서 삭제

- **엔드포인트**: `/documents/${documentId}`
- **메서드**: DELETE
- **동작**:
  - 삭제된 문서의 **하위 문서**는 삭제된 문서의 부모 문서를 새로운 부모로 설정합니다.

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

#### 5. 문서 상세

- **엔드포인트**: `/documents/${documentId}`
- **메서드**: GET
- **응답**:
  ```json
  {
    "id": number,
    "title": string,
    "content": string,
    "createdAt": string,
    "updatedAt": string
  }
  ```

## 에러 코드와 상황별 설명

### 1. 문서 목록 API (`/documents` - GET)

- **200 OK**: 문서 목록을 성공적으로 조회함.
- **500 Internal Server Error**: 서버 내부 오류 발생.

### 2. 문서 생성 API (`/documents` - POST)

- **201 Created**: 문서가 성공적으로 생성됨.
- **400 Bad Request**:
  - `title`이 없거나 유효하지 않음.
  - `parent`가 순환 참조를 유발.
- **500 Internal Server Error**: 데이터베이스 저장 오류.

### 3. 문서 삭제 API (`/documents/${documentId}` - DELETE)

- **200 OK**: 문서와 관련된 동작이 성공적으로 처리됨.
  - 하위 문서가 삭제된 문서의 부모 문서를 새로운 부모로 설정.
- **404 Not Found**: 삭제하려는 문서를 찾을 수 없음.
- **500 Internal Server Error**: 데이터베이스 삭제 과정에서 오류 발생.

### 4. 문서 수정 API (`/documents/${documentId}` - PATCH)

- **200 OK**: 문서가 성공적으로 수정됨.
- **400 Bad Request**: 잘못된 `title` 또는 `content`.
- **404 Not Found**: 수정하려는 문서를 찾을 수 없음.
- **500 Internal Server Error**: 데이터베이스 수정 오류.

### 5. 문서 상세 API (`/documents/${documentId}` - GET)

- **200 OK**: 요청한 문서의 상세 정보를 성공적으로 조회함.
- **404 Not Found**: 요청한 문서를 찾을 수 없음.
- **500 Internal Server Error**: 서버 내부 오류 발생.

## 에러 응답 형식

일관성을 유지하기 위해 모든 에러 응답은 아래 형식을 따릅니다:

```json
{
  "status": <HTTP 상태 코드>,
  "error": "<에러 요약>",
  "message": "<에러 상세 메시지>"
}
```

### 예시

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "유효하지 않은 상위 문서 ID."
}
```
