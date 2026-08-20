import { redirect } from "react-router";

import { logout } from "../api/session.server";
import type { Route } from "./+types/logout";

/**
 * 세션 쿠키를 지운다. 화면이 없는 라우트다 — 헤더의 로그아웃 폼이 여기로 POST 한다.
 *
 * GET 이 아니라 POST 인 이유: 브라우저·확장이 링크를 미리 긁어가면서 GET 을 날리면
 * 사용자가 누르지도 않았는데 로그아웃된다.
 */
export async function action({ request }: Route.ActionArgs) {
  return logout(request);
}

export async function loader() {
  return redirect("/");
}
