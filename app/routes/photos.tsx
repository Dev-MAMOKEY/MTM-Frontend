import { useRef } from "react";
import { useFetcher } from "react-router";

import { ApiError } from "../api/client.server";
import { EmptyState } from "../components/EmptyState";
import { FieldError } from "../components/FieldError";
import { Header } from "../components/Header";
import { OutlineButton } from "../components/OutlineButton";
import { PageTitle } from "../components/PageTitle";
import { PhotoCard } from "../components/PhotoCard";
import { getPhotos, uploadPhoto } from "../api/photos.server";
import { requireAccessToken } from "../api/session.server";
import type { Route } from "./+types/photos";

export function meta({}: Route.MetaArgs) {
  return [{ title: "내 사진 · MTM" }];
}

/** `2026-08-05 올림`. 초 단위까지 보여줄 이유가 없다. */
function formatUploadedAt(createdAt: string | undefined) {
  if (!createdAt) {
    return "올린 시각을 알 수 없음";
  }

  const date = new Date(createdAt);

  return Number.isNaN(date.getTime())
    ? "올린 시각을 알 수 없음"
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} 올림`;
}

export async function loader({ request }: Route.LoaderArgs) {
  const token = await requireAccessToken(request);

  // 이미지 없는 사진은 카드로 그릴 게 없다.
  const photos = (await getPhotos(token)).flatMap((photo) =>
    photo.id == null || !photo.imageUrl
      ? []
      : [
          {
            id: photo.id,
            imageUrl: photo.imageUrl,
            meta: formatUploadedAt(photo.createdAt),
          },
        ],
  );

  return { photos };
}

export async function action({ request }: Route.ActionArgs) {
  const token = await requireAccessToken(request);
  const file = (await request.formData()).get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "사진 파일을 선택해 주세요." };
  }

  try {
    await uploadPhoto(token, file);
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message || "사진을 올리지 못했습니다." };
    }

    throw error;
  }

  // 이동하지 않는다. 올린 사진이 이 화면에 쌓이는 것을 보여주는 게 이 흐름의 요점이고,
  // fetcher 가 끝나면 loader 가 다시 돌아 새 사진이 목록에 들어온다.
  return { error: null };
}

export default function Photos({ loaderData }: Route.ComponentProps) {
  const { photos } = loaderData;
  const fetcher = useFetcher<typeof action>();
  const fileInput = useRef<HTMLInputElement>(null);

  const uploading = fetcher.state !== "idle";

  return (
    <div className="flex min-h-screen flex-col bg-surface-base">
      <Header />
      <main className="flex w-full flex-col gap-5 px-10 py-6">
        <div className="flex w-full items-center justify-between">
          <PageTitle>내 사진</PageTitle>
          {/* 파일 입력은 브라우저마다 생김새가 달라 시안과 맞출 수 없다.
              숨겨두고 시안의 버튼이 대신 열게 한다. */}
          <fetcher.Form method="post" encType="multipart/form-data">
            <input
              ref={fileInput}
              type="file"
              name="file"
              accept="image/*"
              className="hidden"
              // 고른 즉시 올린다 — 「선택」과 「올리기」를 두 번 누르게 할 이유가 없다
              onChange={(e) => {
                if (e.target.files?.length) {
                  fetcher.submit(e.currentTarget.form);
                }
              }}
            />
            <OutlineButton
              type="button"
              disabled={uploading}
              onClick={() => fileInput.current?.click()}
            >
              {uploading ? "올리는 중…" : "+ 사진 올리기"}
            </OutlineButton>
          </fetcher.Form>
        </div>
        {fetcher.data?.error ? (
          <FieldError>{fetcher.data.error}</FieldError>
        ) : null}
        {photos.length === 0 ? (
          // 사진 0장이면 페이지 전체가 EmptyState 다
          <EmptyState>
            아직 올린 사진이 없습니다.
            <br />
            전신 사진을 올리면 여기에 쌓입니다.
          </EmptyState>
        ) : (
          // 최신 업로드가 좌측 — 백엔드가 최신순으로 준다
          <div className="flex w-full flex-wrap items-start gap-[18px]">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                state="none"
                imageUrl={photo.imageUrl}
                meta={photo.meta}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
