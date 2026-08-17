import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { OutlineButton } from "../components/OutlineButton";
import { PageTitle } from "../components/PageTitle";
import { PhotoCard } from "../components/PhotoCard";
import { getPhotos } from "../api/photos.server";
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

export default function Photos({ loaderData }: Route.ComponentProps) {
  const { photos } = loaderData;

  return (
    <div className="flex min-h-screen flex-col bg-surface-base">
      <Header />
      <main className="flex w-full flex-col gap-5 px-10 py-6">
        <div className="flex w-full items-center justify-between">
          <PageTitle>내 사진</PageTitle>
          <OutlineButton type="button">+ 사진 올리기</OutlineButton>
        </div>
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
