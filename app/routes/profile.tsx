import { useState } from "react";

import { FieldInput } from "../components/FieldInput";
import { Header } from "../components/Header";
import { OutlineButton } from "../components/OutlineButton";
import { PageTitle } from "../components/PageTitle";
import { SectionTitle } from "../components/SectionTitle";
import { getMe } from "../api/members.server";
import { requireAccessToken } from "../api/session.server";
import type { Route } from "./+types/profile";

export async function loader({ request }: Route.LoaderArgs) {
  const token = await requireAccessToken(request);
  const me = await getMe(token);

  // 저장된 값이 없으면 빈 칸으로 둔다. 0 을 넣으면 사용자가 0 을 저장한 것처럼 보인다.
  return {
    email: me.email ?? "",
    height: me.heightCm != null ? String(me.heightCm) : "",
    weight: me.weightKg != null ? String(me.weightKg) : "",
  };
}

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

export default function Profile({ loaderData }: Route.ComponentProps) {
  const [height, setHeight] = useState(loaderData.height);
  const [weight, setWeight] = useState(loaderData.weight);

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
        <hr className="border-0 border-t border-border-default" />
        <p className="text-caption text-text-tertiary">
          이메일 <span className="ml-2">{loaderData.email}</span>
        </p>
      </main>
    </>
  );
}
