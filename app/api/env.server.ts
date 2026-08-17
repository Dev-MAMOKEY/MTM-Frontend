/**
 * 서버 전용 환경변수.
 *
 * `.env` 는 깃에 올리지 않으니 값이 비어 있는 채로 실행될 수 있다. 그 상태로 요청을
 * 받으면 `undefined/products` 같은 주소로 조용히 404가 나서 원인을 찾기 어렵다.
 * 모듈이 로드되는 시점에 바로 실패시킨다.
 *
 * 파일명의 `.server` 접미사는 React Router 가 이 모듈을 클라이언트 번들에서
 * 제외한다는 표시다. 서버 주소가 브라우저로 새지 않는다.
 */

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `환경변수 ${name} 가 없다. \`cp .env.example .env\` 후 값을 채운다.`,
    );
  }

  return value;
}

/** 백엔드 API 서버 주소. 뒤쪽 슬래시는 떼서 경로 결합 시 `//` 가 생기지 않게 한다. */
export const API_BASE_URL = required("API_BASE_URL").replace(/\/+$/, "");
