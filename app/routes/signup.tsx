import { useState } from "react";
import { Form, Link, redirect, useNavigation } from "react-router";

import { login, signup } from "../api/auth.server";
import { ApiError } from "../api/client.server";
import { createUserSession, hasSession } from "../api/session.server";
import { FieldError } from "../components/FieldError";
import { HeroPanel } from "../components/HeroPanel";
import { Logo } from "../components/Logo";
import { FieldInput } from "../components/FieldInput";
import { OutlineButton } from "../components/OutlineButton";
import type { Route } from "./+types/signup";

export function meta({}: Route.MetaArgs) {
  return [{ title: "가입 · MTM" }];
}

/** 백엔드 SignupRequestDTO 의 제약. 서버가 거절하기 전에 화면에서 먼저 알려준다. */
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 20;

export async function loader({ request, context }: Route.LoaderArgs) {
  if (hasSession(context)) {
    throw redirect("/");
  }

  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const passwordConfirm = String(form.get("passwordConfirm") ?? "");

  if (password !== passwordConfirm) {
    return { error: "비밀번호가 서로 다릅니다." };
  }

  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return {
      error: `비밀번호는 ${PASSWORD_MIN}~${PASSWORD_MAX}자로 입력해 주세요.`,
    };
  }

  try {
    await signup({ email, password });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message || "가입에 실패했습니다." };
    }

    throw error;
  }

  // 가입 응답에는 토큰이 없다(RsDataString). 하지만 방금 받은 값을 우리가 들고 있으니
  // 대신 로그인해준다 — 같은 이메일·비밀번호를 두 번 치게 할 이유가 없다.
  try {
    const tokens = await login({ email, password });

    if (tokens.accessToken && tokens.refreshToken) {
      return await createUserSession(
        request,
        { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken },
        // 가입한 계정은 신체 정보가 없어 착용 화면이 첫 설정으로 이어준다.
        "/",
      );
    }
  } catch {
    // 자동 로그인이 실패해도 가입은 이미 됐다. 실패로 되돌리지 않고 로그인 화면으로 보낸다.
  }

  return redirect("/login");
}

export default function Signup({ actionData }: Route.ComponentProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigation = useNavigation();

  const submitting = navigation.state === "submitting";
  // 확인 칸을 채우는 동안 알린다. 비어 있을 때는 아직 틀린 것이 아니므로 말하지 않는다.
  const confirmError =
    passwordConfirm && passwordConfirm !== password
      ? "비밀번호가 서로 다릅니다"
      : undefined;
  const canSubmit =
    email.includes("@") &&
    password.length >= PASSWORD_MIN &&
    password.length <= PASSWORD_MAX &&
    passwordConfirm.length > 0 &&
    !confirmError &&
    !submitting;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-page flex-col lg:h-screen lg:flex-row">
      <HeroPanel />
      {/* 시안은 폼을 갈라진 자리에서 133px 안쪽에 둔다 — 가운데 정렬이 아니다 */}
      <Form
        method="post"
        className="flex w-full max-w-[360px] flex-col gap-4 px-4 pt-10 lg:px-0 lg:pt-[300px] lg:ml-[133px]"
      >
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="h-[10px]" />
        <FieldInput
          label="이메일"
          name="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FieldInput
          label={`비밀번호 (${PASSWORD_MIN}~${PASSWORD_MAX}자)`}
          name="password"
          type="password"
          revealable
          placeholder={`${PASSWORD_MIN}~${PASSWORD_MAX}자`}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FieldInput
          label="비밀번호 확인"
          name="passwordConfirm"
          type="password"
          revealable
          placeholder="한 번 더 입력"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          error={confirmError}
        />
        {actionData?.error ? <FieldError>{actionData.error}</FieldError> : null}
        <div>
          <OutlineButton type="submit" disabled={!canSubmit}>
            {submitting ? "가입 중…" : "가입하기"}
          </OutlineButton>
        </div>
        <p className="text-caption text-text-tertiary">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="underline">
            로그인
          </Link>
        </p>
      </Form>
    </div>
  );
}
