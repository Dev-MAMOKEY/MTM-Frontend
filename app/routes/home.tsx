import { useRef, useState } from "react";
import { Link, redirect, useFetcher, useNavigate } from "react-router";

import { SpecTag } from "../components/SpecTag";
import { EmptyState } from "../components/EmptyState";
import { FieldError } from "../components/FieldError";
import { Header } from "../components/Header";
import { IconButton } from "../components/IconButton";
import { OutlineButton } from "../components/OutlineButton";
import { PhotoThumb, PhotoUploadSlot } from "../components/PhotoThumb";
import { ProductTile } from "../components/ProductTile";
import { ProgressBar } from "../components/ProgressBar";
import { getMe, hasBodyInfo } from "../api/members.server";
import { toListedProducts } from "../api/product";
import { getProducts } from "../api/products.server";
import { ACCEPT_ATTRIBUTE } from "../api/photo";
import { getPhotos } from "../api/photos.server";
import { requireAccessToken } from "../api/session.server";
import type { Route } from "./+types/home";

/** Z3 는 훑어보는 자리라 한 화면 분량만 받는다. 전체는 「전체 →」로 목록 화면에 간다. */
const Z3_PRODUCT_COUNT = 20;

export async function loader({ request, context }: Route.LoaderArgs) {
  const token = await requireAccessToken(request, context);
  const [me, allPhotos, productPage] = await Promise.all([
    getMe(token),
    getPhotos(token),
    // Z3 는 훑어보는 자리다. 전체가 필요하면 「전체 →」로 목록 화면에 간다.
    getProducts(token, { page: 1, size: Z3_PRODUCT_COUNT }),
  ]);

  // 신체 정보 없이는 착용 이미지를 만들 수 없다. 첫 로그인이면 여기서 설정으로 보낸다.
  // 로그인 직후만이 아니라 진입할 때마다 보므로 다른 경로로 들어와도 빠져나갈 수 없다.
  if (!hasBodyInfo(me)) {
    throw redirect("/profile?setup=1");
  }

  // 최신순으로 온다 — 띠의 왼쪽이 가장 최근이다.
  const photos = allPhotos.flatMap((photo) =>
    photo.id == null || !photo.imageUrl
      ? []
      : [
          {
            id: photo.id,
            imageUrl: photo.imageUrl,
            baseImageId: photo.baseImage?.id,
            baseImageUrl: photo.baseImage?.imageUrl,
          },
        ],
  );

  // 고른 사진을 주소에 둔다 — 새로고침해도 남고 링크로 공유된다.
  // 고른 적이 없으면 가장 최근 사진이다(시안: "마지막에 쓰던 사진이 선택된 상태").
  const asked = Number(new URL(request.url).searchParams.get("photo"));
  const selected =
    photos.find((photo) => photo.id === asked) ?? photos[0] ?? null;

  return {
    photos,
    selected,
    products: toListedProducts(productPage.content ?? []),
    totalProductCount: productPage.totalElements ?? 0,
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MTM" },
    { name: "description", content: "내 사진 위에서 MCM 제품을 입어봅니다." },
  ];
}

/** Figma 시안이 그린 착용 화면의 여섯 가지 상태. */
type LookState =
  | "ready" // 3-2  정상
  | "no-photo" // 5-2  사진 없음
  | "generating-base" // 5-69 기준 이미지 생성 중
  | "no-product" // 6-2  제품 미선택
  | "generating" // 6-65 착용 이미지 생성 중
  | "failed"; // 7-2  생성 실패

export default function Home({ loaderData }: Route.ComponentProps) {
  const { photos, selected, products, totalProductCount } = loaderData;
  const navigate = useNavigate();
  const upload = useFetcher<{ error: string | null }>();
  const baseImage = useFetcher();
  const fileInput = useRef<HTMLInputElement>(null);

  // Z2·Z3(착용 이미지)는 아직 목이다 — 슬라이스 6에서 붙인다.
  // Z1(내 사진)만 실제 데이터로 돈다.
  const [mockState] = useState<LookState>("ready");

  const hasPhoto = photos.length > 0;
  const generatingBase = baseImage.state !== "idle";
  const state: LookState = !hasPhoto
    ? "no-photo"
    : generatingBase
      ? "generating-base"
      : mockState;

  // 흐림은 존마다 다르다. 착용 이미지 생성 중에는 Z3를 흐리지 않는다 —
  // 다른 제품을 눌러 요청을 교체할 수 있어야 비교 흐름이 끊기지 않는다.
  // 반대로 기준 이미지가 없으면 착용 이미지를 만들 수 없으므로 Z3를 흐린다.
  const dimStage = state === "no-photo";
  const dimProducts = state === "no-photo" || state === "generating-base";

  return (
    <div className="flex h-screen flex-col bg-surface-base">
      <Header />

      {/* Z1 · 내 사진 */}
      <section className="flex w-full flex-col gap-[10px] border-b border-solid border-border-default p-[14px]">
        <div className="flex w-full items-start justify-between text-text-tertiary">
          <h2 className="text-[10px] font-medium tracking-[1px]">내 사진</h2>
          <Link to="/photos" className="text-[11px]">
            전체 보기 →
          </Link>
        </div>
        {hasPhoto ? (
          <div className="flex items-center gap-2">
            {photos.map((photo, i) => (
              <PhotoThumb
                key={photo.id}
                selected={photo.id === selected?.id}
                label={`사진 ${i + 1}`}
                imageUrl={photo.imageUrl}
                onClick={() => navigate(`?photo=${photo.id}`)}
              />
            ))}
            <PhotoUploadSlot onClick={() => fileInput.current?.click()} />
          </div>
        ) : null}
        {/* 업로드는 사진첩의 action 을 그대로 쓴다 — 같은 일을 두 곳에 두지 않는다 */}
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              const body = new FormData();
              body.append("file", file);

              upload.submit(body, {
                action: "/photos",
                method: "post",
                encType: "multipart/form-data",
              });
            }
          }}
        />
        {upload.state !== "idle" ? (
          <ProgressBar
            label="사진을 올리는 중"
            width={240}
            className="items-start gap-[6px]"
          />
        ) : null}
        {/* 올리기가 거절되면 여기서 알린다 — 없으면 아무 일도 안 일어난 것처럼 보인다 */}
        {upload.data?.error ? <FieldError>{upload.data.error}</FieldError> : null}
        {/* 고른 사진에 기준 이미지가 없으면 여기서 만든다 — 없으면 착용 이미지도 못 만든다 */}
        {selected && !selected.baseImageId && !generatingBase ? (
          <baseImage.Form method="post" action="/photos">
            <input type="hidden" name="intent" value="create-base-image" />
            <input type="hidden" name="photoId" value={selected.id} />
            <OutlineButton type="submit">기준 이미지 만들기</OutlineButton>
          </baseImage.Form>
        ) : null}
        {state === "generating-base" ? (
          <ProgressBar
            label="기준 이미지를 만드는 중"
            width={240}
            className="items-start gap-[6px]"
          />
        ) : null}
        {!hasPhoto ? (
          <EmptyState
            action={
              <OutlineButton
                type="button"
                onClick={() => fileInput.current?.click()}
              >
                사진 올리기
              </OutlineButton>
            }
          >
            아직 올린 사진이 없습니다
          </EmptyState>
        ) : null}
      </section>

      <div className="flex w-full flex-1 items-start overflow-hidden">
        {/* Z2 · LookStage */}
        <section
          className={
            "flex h-full min-w-px flex-1 flex-col gap-[10px] border-r border-solid border-border-default p-5 " +
            (dimStage ? "opacity-35" : "")
          }
        >
          <LookStage state={state} />
        </section>

        {/* Z3 · 제품 */}
        <section
          className={
            "flex h-full w-[300px] shrink-0 flex-col gap-[10px] overflow-y-auto p-5 " +
            (dimProducts ? "opacity-35" : "")
          }
        >
          <div className="flex w-full items-start justify-between text-text-tertiary">
            <h2 className="text-[10px] font-medium tracking-[1px]">
              제품 {totalProductCount}
            </h2>
            <Link to="/products" className="text-[11px]">
              전체 →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductTile
                key={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function LookStage({ state }: { state: LookState }) {
  // 기준 이미지가 아직 없으므로 제품명·태그·액션을 감춘다
  if (state === "generating-base") {
    return (
      <EmptyState className="flex-1">
        기준 이미지가 만들어지면 여기에 표시됩니다
      </EmptyState>
    );
  }

  if (state === "no-product") {
    return (
      <EmptyState className="flex-1">
        <p>오른쪽에서 제품을 골라보세요</p>
        <p>(모바일: 아래에서)</p>
      </EmptyState>
    );
  }

  if (state === "failed") {
    return (
      <EmptyState
        className="flex-1"
        action={<OutlineButton type="button">다시 시도</OutlineButton>}
      >
        <p>착용 이미지를 만들지 못했습니다</p>
        <p>잠시 후 다시 시도해 주세요</p>
      </EmptyState>
    );
  }

  if (state === "generating") {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-[10px] border border-solid border-border-default bg-surface-track">
        <ProgressBar value={55} label="착용 이미지를 만드는 중" />
      </div>
    );
  }

  // ready — 조작 요소는 전부 무대 바깥 아래에 둔다
  return (
    <>
      <div className="flex w-full min-h-px flex-1 flex-col items-center justify-center border border-solid border-border-default bg-surface-track" />
      <p className="text-body text-text-primary">Aren Zip Hobo in Visetos</p>
      <div className="flex gap-[6px]">
        <SpecTag>14.2 × 11.8 IN</SpecTag>
      </div>
      <div className="flex items-center gap-[10px]">
        <OutlineButton type="button">다시 만들기</OutlineButton>
        <IconButton type="button" aria-label="선택 해제">
          ×
        </IconButton>
      </div>
    </>
  );
}
