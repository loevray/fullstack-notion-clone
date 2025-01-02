import { API_END_POINT } from "../env.js";
export const request = async (url, options = {}) => {
  try {
    const res = await fetch(
      `${API_END_POINT}${url.startsWith("/") ? url : `/${url}`}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      }
    );

    let result;

    result = await res.json();

    if (res.ok) {
      return result;
    }

    console.log(
      `서버로부터 응답 오류가 발생했습니다.code: ${res.status}, message: ${result.message}`
    );
  } catch (e) {
    console.log(`서버와의 통신 장애 발생 : ${e}`);
  }
};
