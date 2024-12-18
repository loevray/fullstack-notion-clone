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
    if (res.ok) {
      return await res.json();
    }
    throw new Error(`http통신중 오류발생 : ${res.status}`);
  } catch (e) {
    console.log(`api불러오다가 오류 캐치 : ${e}`);
  }
};
