import { useState } from "react";
import { Form, useNavigation } from "react-router";

import { ApiError } from "../api/client.server";
import { getMe, saveBodyInfo } from "../api/members.server";
import { FieldError } from "../components/FieldError";
import { FieldInput } from "../components/FieldInput";
import { Header } from "../components/Header";
import { OutlineButton } from "../components/OutlineButton";
import { PageTitle } from "../components/PageTitle";
import { SectionTitle } from "../components/SectionTitle";
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

export async function action({ request }: Route.ActionArgs) {
  const token = await requireAccessToken(request);
  const form = await request.formData();
  const heightCm = Number(form.get("height"));
  const weightKg = Number(form.get("weight"));

  // 화면에서 이미 막지만 폼은 우회할 수 있다. 서버에 보내기 전에 한 번 더 본다.
  if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg)) {
    return { error: "키와 몸무게를 숫자로 입력해 주세요.", saved: false };
  }

  try {
    await saveBodyInfo(token, { heightCm, weightKg });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message || "저장하지 못했습니다.", saved: false };
    }

    throw error;
  }

  // 이동하지 않는다 — 저장 후에도 같은 화면에 머무는 것이 이 화면의 쓰임이다.
  // loader 가 다시 돌아 방금 저장한 값을 서버에서 받아온다.
  return { error: null, saved: true };
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

export default function Profile({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [height, setHeight] = useState(loaderData.height);
  const [weight, setWeight] = useState(loaderData.weight);
  const navigation = useNavigation();

  const heightError = validate(height, 100, 250, "키");
  const weightError = validate(weight, 30, 200, "몸무게");

  const saving = navigation.state === "submitting";
  const canSave =
    height !== "" && weight !== "" && !heightError && !weightError && !saving;

  // 저장한 뒤 값을 고치는 중이면 「저장됨」을 지운다 — 화면과 어긋난 안내가 남는다.
  const dirty =
    height !== loaderData.height || weight !== loaderData.weight;

  return (
    <>
      <Header />
      <Form
        method="post"
        className="flex w-[420px] flex-col gap-[18px] px-[60px] pt-[110px]"
      >
        <PageTitle>내 정보</PageTitle>
        <SectionTitle>신체 정보</SectionTitle>
        <FieldInput
          label="키 (cm)"
          name="height"
          inputMode="numeric"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          error={heightError}
        />
        <FieldInput
          label="몸무게 (kg)"
          name="weight"
          inputMode="numeric"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          error={weightError}
        />
        {actionData?.error ? <FieldError>{actionData.error}</FieldError> : null}
        <div className="flex items-center gap-3">
          <OutlineButton type="submit" disabled={!canSave}>
            {saving ? "저장 중…" : "저장"}
          </OutlineButton>
          {actionData?.saved && !dirty ? (
            <span className="text-caption text-text-tertiary">저장됨</span>
          ) : null}
        </div>
        <hr className="border-0 border-t border-border-default" />
        <p className="text-caption text-text-tertiary">
          이메일 <span className="ml-2">{loaderData.email}</span>
        </p>
      </Form>
    </>
  );
}
