/**
 * 사진 업로드 제약. 화면(`accept`)과 서버(action 검증)가 같은 목록을 봐야 해서
 * `.server` 가 아닌 자리에 둔다.
 */

/**
 * 올릴 수 있는 사진 형식.
 *
 * `image/*` 로 열어두면 iPhone 의 HEIC 같은 것도 통과하는데, 그런 파일은
 * **업로드는 되고 기준 이미지 생성에서 502(IMAGE_GENERATION_ERROR)** 로 떨어진다.
 * 사용자는 사진이 잘 올라간 줄 알았다가 한참 뒤에 원인 모를 실패를 본다.
 * 받는 자리에서 막는다.
 */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"] as const;

/** `<input type="file">` 의 accept 에 넣을 값. */
export const ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(",");

/**
 * accept 는 파일 선택창의 기본 필터일 뿐이다. 「모든 파일」로 바꿔 고르거나
 * 끌어다 놓으면 그대로 통과하므로 서버에서 한 번 더 본다.
 */
export function isAcceptedImage(file: File) {
  return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);
}

export const ACCEPTED_IMAGE_LABEL = "JPG 또는 PNG";
