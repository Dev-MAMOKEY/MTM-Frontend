import { useState } from "react";
import { Link } from "react-router";

import { FieldError } from "../components/FieldError";
import { FieldInput } from "../components/FieldInput";
import { OutlineButton } from "../components/OutlineButton";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [{ title: "로그인 · MTM" }];
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 인증 요청은 슬라이스 2에서 붙인다. 지금은 입력 유효성만 본다.
  const canSubmit = email.includes("@") && password.length > 0;
  const error = null;

  return (
    <main className="mx-auto flex w-[360px] flex-col gap-4 pt-[300px]">
      <p className="text-center text-[20px] font-bold tracking-[2px] text-text-primary">
        MTM
      </p>
      <div className="h-[10px]" />
      <FieldInput
        label="이메일"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FieldInput
        label="비밀번호"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error ? <FieldError>{error}</FieldError> : null}
      <div>
        <OutlineButton type="submit" disabled={!canSubmit}>
          로그인
        </OutlineButton>
      </div>
      <p className="text-caption text-text-tertiary">
        계정이 없으신가요?{" "}
        <Link to="/signup" className="underline">
          가입하기
        </Link>
      </p>
    </main>
  );
}
