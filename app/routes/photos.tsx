import { Header } from "../components/Header";
import { OutlineButton } from "../components/OutlineButton";
import { PageTitle } from "../components/PageTitle";
import { PhotoCard } from "../components/PhotoCard";
import type { Route } from "./+types/photos";

export function meta({}: Route.MetaArgs) {
  return [{ title: "내 사진 · MTM" }];
}

export default function Photos() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex w-full flex-col gap-5 px-10 py-6">
        <div className="flex w-full items-center justify-between">
          <PageTitle>내 사진</PageTitle>
          <OutlineButton type="button">+ 사진 올리기</OutlineButton>
        </div>
        {/* 최신 업로드가 좌측 */}
        <div className="flex w-full flex-wrap items-start gap-[18px]">
          <PhotoCard
            state="done"
            meta="2026-08-05 올림 · 착용 이미지 4장"
            lookCount={4}
          />
          <PhotoCard state="generating" meta="방금 올림" />
          <PhotoCard state="failed" meta="2026-08-04 올림" />
        </div>
      </main>
    </div>
  );
}
