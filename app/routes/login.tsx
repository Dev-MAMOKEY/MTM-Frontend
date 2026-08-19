import { useState } from "react";
import { Form, Link, redirect, useNavigation } from "react-router";

import { ApiError } from "../api/client.server";
import { login } from "../api/auth.server";
import { createUserSession, hasSession } from "../api/session.server";
import { FieldError } from "../components/FieldError";
import { HeroPanel } from "../components/HeroPanel";
import { Logo } from "../components/Logo";
import { FieldInput } from "../components/FieldInput";
import { OutlineButton } from "../components/OutlineButton";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [{ title: "로그인 · MTM" }];
}

/** 이미 로그인한 사람에게 로그인 화면을 보여줄 이유가 없다. */
export async function loader({ request, context }: Route.LoaderArgs) {
  if (hasSession(context)) {
    throw redirect("/");
  }

  // requireAuth 가 붙여 보낸 원래 목적지. 로그인 후 그 자리로 돌려보낸다.
  const redirectTo = new URL(request.url).searchParams.get("redirectTo");

  return { redirectTo: safeRedirect(redirectTo) };
}

/**
 * 열린 리다이렉트를 막는다. `?redirectTo=https://악성사이트` 를 그대로 믿으면
 * 로그인 직후 외부로 튕겨 보낼 수 있다. 같은 사이트의 절대경로만 받는다.
 */
function safeRedirect(to: string | null) {
  return to?.startsWith("/") && !to.startsWith("//") ? to : "/";
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  // 로그인 전에 가려던 곳. 없으면 착용 화면으로 보낸다.
  const redirectTo = safeRedirect(String(form.get("redirectTo") || ""));

  try {
    const tokens = await login({ email, password });

    // 응답 필드가 전부 optional 이라 토큰이 없는 채로 세션을 만들 수 있다.
    // 그러면 이후 모든 요청이 401 인데 화면은 로그인된 것처럼 보인다.
    if (!tokens.accessToken || !tokens.refreshToken) {
      return { error: "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요." };
    }

    return await createUserSession(
      request,
      { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken },
      redirectTo,
    );
  } catch (error) {
    if (error instanceof ApiError) {
      // 이메일이 틀렸는지 비밀번호가 틀렸는지는 알려주지 않는다 — 계정 존재 여부가 새어 나간다.
      return { error: error.message || "이메일 또는 비밀번호가 올바르지 않습니다." };
    }

    throw error;
  }
}

export default function Login({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const submitting = navigation.state === "submitting";
  const canSubmit = email.includes("@") && password.length > 0 && !submitting;

  return (
    <div className="mx-auto flex h-screen w-full max-w-page">
      <HeroPanel />
      {/* 시안은 폼을 갈라진 자리에서 133px 안쪽에 둔다 — 가운데 정렬이 아니다 */}
      <Form
        method="post"
        className="flex w-[360px] flex-col gap-4 pt-[300px] lg:ml-[133px]"
      >
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="h-[10px]" />
        <input type="hidden" name="redirectTo" value={loaderData.redirectTo} />
        <FieldInput
          label="이메일"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FieldInput
          label="비밀번호"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {actionData?.error ? <FieldError>{actionData.error}</FieldError> : null}
        <div>
          <OutlineButton type="submit" disabled={!canSubmit}>
            {submitting ? "로그인 중…" : "로그인"}
          </OutlineButton>
        </div>
        <p className="text-caption text-text-tertiary">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="underline">
            가입하기
          </Link>
        </p>
      </Form>
    </div>
  );
}
