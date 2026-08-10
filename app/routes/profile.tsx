import { useState } from "react";

import { FieldInput } from "../components/FieldInput";
import { Header } from "../components/Header";
import { OutlineButton } from "../components/OutlineButton";
import { PageTitle } from "../components/PageTitle";
import { SectionTitle } from "../components/SectionTitle";
import type { Route } from "./+types/profile";

export function meta({}: Route.MetaArgs) {
  return [{ title: "내 정보 · MTM" }];
}

/** 값이 비었으면 오류를 내지 않는다 — 아직 건드리지 않은 필드이므로. */
function validate(value: string, min: number, max: number, label: string) {
  if (value === "") return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return `${label}를 숫자로 입력해 주세요`;
  if (parsed < min || parsed > max)
    return `${label}는 ${min}~${max} 사이로 입력해 주세요`;
  return undefined;
}

export default function Profile() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const heightError = validate(height, 100, 250, "키");
  const weightError = validate(weight, 30, 200, "몸무게");

  // 저장 API는 슬라이스 3에서 붙인다.
  const canSave =
    height !== "" && weight !== "" && !heightError && !weightError;

  return (
    <>
      <Header />
      <main className="flex w-[420px] flex-col gap-[18px] px-[60px] pt-[110px]">
        <PageTitle>내 정보</PageTitle>
        <SectionTitle>신체 정보</SectionTitle>
        <FieldInput
          label="키 (cm)"
          inputMode="numeric"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          error={heightError}
        />
        <FieldInput
          label="몸무게 (kg)"
          inputMode="numeric"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          error={weightError}
        />
        <div>
          <OutlineButton type="submit" disabled={!canSave}>
            저장
          </OutlineButton>
        </div>
        <hr className="border-0 border-t border-line" />
        <p className="text-[12px] text-ink-subtle">
          이메일 <span className="ml-2">user@example.com</span>
        </p>
      </main>
    </>
  );
}
