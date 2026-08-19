import { useRef } from "react";
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
import { ApiError } from "../api/client.server";
import { getMe, hasBodyInfo } from "../api/members.server";
import { toListedProducts, toProductDetail } from "../api/product";
import { getProduct, getProducts } from "../api/products.server";
import { ACCEPT_ATTRIBUTE } from "../api/photo";
import { getPhotos } from "../api/photos.server";
import { requireAuth, type Auth } from "../api/session.server";
import {
  createWornImage,
  getWornImages,
  regenerateWornImage,
} from "../api/worn-images.server";
import type { Route } from "./+types/home";

/** Z3 는 훑어보는 자리라 한 화면 분량만 받는다. 전체는 「전체 →」로 목록 화면에 간다. */
const Z3_PRODUCT_COUNT = 20;

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = requireAuth(request, context);
  const [me, allPhotos, productPage] = await Promise.all([
    getMe(auth),
    getPhotos(auth),
    // Z3 는 훑어보는 자리다. 전체가 필요하면 「전체 →」로 목록 화면에 간다.
    getProducts(auth, { page: 1, size: Z3_PRODUCT_COUNT }),
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

  // 고른 제품도 주소에 둔다. 기준 이미지가 있어야 착용 이미지가 성립한다.
  const askedProduct = Number(
    new URL(request.url).searchParams.get("product"),
  );
  const worn =
    selected?.baseImageId != null && Number.isInteger(askedProduct)
      ? await findWornImage(auth, selected.baseImageId, askedProduct)
      : null;

  return {
    photos,
    selected,
    products: toListedProducts(productPage.content ?? []),
    totalProductCount: productPage.totalElements ?? 0,
    worn,
  };
}

/**
 * 이미 만들어 둔 착용 이미지를 찾는다.
 *
 * 생성 응답을 화면에 들고 있지 않고 목록에서 다시 찾는 이유는 새로고침 때문이다 —
 * 만든 직후에만 보이면 이 화면의 값어치가 절반이 된다.
 *
 * 제품 이름과 치수는 목록 응답에 없어 상세를 함께 부른다.
 */
async function findWornImage(
  auth: Auth,
  baseImageId: number,
  productId: number,
) {
  const found = (await getWornImages(auth, baseImageId)).find(
    (wornImage) => wornImage.productId === productId,
  );

  if (!found?.imageUrl) {
    return null;
  }

  const detail = toProductDetail(await getProduct(auth, productId));

  return {
    imageUrl: found.imageUrl,
    productId,
    name: detail?.name ?? "",
    // 시안의 `14.2 × 11.8 IN`. 목록에는 치수가 없어 상세에서 가져온다.
    size: detail?.sizeLabel,
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MTM" },
    { name: "description", content: "내 사진 위에서 MCM 제품을 입어봅니다." },
  ];
}

/**
 * 제품을 고르면 착용 이미지를 만든다.
 *
 * 만들고 나서 주소로 되돌려 보낸다. 응답을 화면이 들고 있으면 새로고침에 사라지는데,
 * 주소에 남기면 loader 가 저장된 것을 다시 찾아온다.
 *
 * 이미 만든 조합이면 백엔드가 모델을 부르지 않고 저장된 것을 즉시 준다.
 * 제품을 왔다 갔다 눌러보는 비교 흐름이 값싼 이유가 이것이다.
 */
export async function action({ request, context }: Route.ActionArgs) {
  const auth = requireAuth(request, context);
  const form = await request.formData();
  const baseImageId = Number(form.get("baseImageId"));
  const productId = Number(form.get("productId"));
  const photoId = Number(form.get("photoId"));

  if (!Number.isInteger(baseImageId) || !Number.isInteger(productId)) {
    return { error: "제품을 고를 수 없습니다." };
  }

  // 재생성은 저장된 것을 교체한다. 생성은 멱등이라 같은 조합이면 그대로 돌려주므로,
  // 「다시 만들기」가 생성을 부르면 아무것도 바뀌지 않는다.
  const regenerate = form.get("intent") === "regenerate";

  try {
    await (regenerate ? regenerateWornImage : createWornImage)(
      auth,
      baseImageId,
      { productId },
    );
  } catch (error) {
    if (error instanceof ApiError) {
      // 문구는 시안대로 둔다. 백엔드 메시지를 그대로 띄우면 내부 사정이 새어 나간다.
      return {
        error: regenerate
          ? "착용 이미지를 다시 만들지 못했습니다."
          : "착용 이미지를 만들지 못했습니다.",
      };
    }

    throw error;
  }

  return redirect(`/?photo=${photoId}&product=${productId}`);
}

/**
 * Figma 시안이 그린 착용 화면의 상태들.
 *
 * `no-base` 만 시안에 없다 — 사진은 있는데 기준 이미지를 아직 안 만든 경우다.
 * 시안은 올리면 곧바로 기준 이미지가 만들어지는 흐름을 전제했는데, 실제로는
 * 만들기를 눌러야 시작되므로 그 사이의 자리가 필요하다.
 */
type LookState =
  | "ready" // 3-2  정상
  | "no-photo" // 5-2  사진 없음
  | "generating-base" // 5-69 기준 이미지 생성 중
  | "no-base" // 시안 밖 — 기준 이미지를 아직 만들지 않음
  | "no-product" // 6-2  제품 미선택
  | "generating" // 6-65 착용 이미지 생성 중
  | "failed"; // 7-2  생성 실패

export default function Home({ loaderData }: Route.ComponentProps) {
  const { photos, selected, products, totalProductCount, worn } = loaderData;
  const navigate = useNavigate();
  const upload = useFetcher<{ error: string | null }>();
  const baseImage = useFetcher();
  const wornImage = useFetcher<{ error: string | null }>();
  const fileInput = useRef<HTMLInputElement>(null);
  // 실패한 뒤 「다시 시도」가 어느 제품이었는지 알아야 한다. 실패하면 주소가 바뀌지
  // 않으므로 주소에서는 찾을 수 없다.
  const lastProductId = useRef<number | null>(null);

  const requestWornImage = (productId: number, intent: "create" | "regenerate" = "create") => {
    if (selected?.baseImageId == null) {
      return;
    }

    lastProductId.current = productId;
    wornImage.submit(
      {
        intent,
        baseImageId: selected.baseImageId,
        productId,
        photoId: selected.id,
      },
      { method: "post" },
    );
  };

  const hasPhoto = photos.length > 0;
  const generatingBase = baseImage.state !== "idle";
  const generatingWorn = wornImage.state !== "idle";

  // 어느 상태인지는 데이터가 정한다 — 화면이 따로 들고 있으면 실제와 어긋난다.
  const state: LookState = !hasPhoto
    ? "no-photo"
    : generatingBase
      ? "generating-base"
      : selected?.baseImageId == null
        ? "no-base"
        : generatingWorn
          ? "generating"
          : wornImage.data?.error
            ? "failed"
            : worn
              ? "ready"
              : "no-product";

  // 흐림은 존마다 다르다. 착용 이미지 생성 중에는 Z3를 흐리지 않는다 —
  // 다른 제품을 눌러 요청을 교체할 수 있어야 비교 흐름이 끊기지 않는다.
  // 반대로 기준 이미지가 없으면 착용 이미지를 만들 수 없으므로 Z3를 흐린다.
  const dimStage = state === "no-photo";
  // 기준 이미지가 없으면 제품을 눌러도 착용 이미지를 만들 수 없다.
  const dimProducts =
    state === "no-photo" ||
    state === "generating-base" ||
    state === "no-base";

  return (
    <div className="flex h-screen flex-col bg-surface-base">
      <Header />

      {/* Z1 · 내 사진 */}
      <section className="mx-auto flex w-full max-w-page flex-col gap-[10px] border-b border-solid border-border-default p-[14px]">
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

      <div className="mx-auto flex w-full max-w-page flex-1 items-start overflow-hidden">
        {/* Z2 · LookStage */}
        <section
          className={
            "flex h-full min-w-px flex-1 flex-col gap-[10px] border-r border-solid border-border-default p-5 " +
            (dimStage ? "opacity-35" : "")
          }
        >
          <LookStage
            state={state}
            worn={worn}
            onRetry={() =>
              lastProductId.current != null &&
              requestWornImage(lastProductId.current)
            }
            onRegenerate={() =>
              worn && requestWornImage(worn.productId, "regenerate")
            }
            onClear={() => navigate(`?photo=${selected?.id ?? ""}`)}
          />
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
          {/* 타일을 누르면 상세로 가지 않고 그 자리에서 착용 이미지를 만든다.
              비교 흐름(F3)이 이 서비스의 값어치인데 매번 상세를 거치면 끊긴다. */}
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductTile
                key={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                onClick={() => requestWornImage(product.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

type WornView = {
  imageUrl: string;
  productId: number;
  name: string;
  size?: string;
};

function LookStage({
  state,
  worn,
  onRetry,
  onRegenerate,
  onClear,
}: {
  state: LookState;
  worn: WornView | null;
  onRetry: () => void;
  onRegenerate: () => void;
  onClear: () => void;
}) {
  // 기준 이미지가 아직 없으므로 제품명·태그·액션을 감춘다
  if (state === "generating-base") {
    return (
      <EmptyState className="flex-1">
        기준 이미지가 만들어지면 여기에 표시됩니다
      </EmptyState>
    );
  }

  if (state === "no-base") {
    return (
      <EmptyState className="flex-1">
        위에서 기준 이미지를 먼저 만들어 주세요
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
        action={
          <OutlineButton type="button" onClick={onRetry}>
            다시 시도
          </OutlineButton>
        }
      >
        <p>착용 이미지를 만들지 못했습니다</p>
        <p>잠시 후 다시 시도해 주세요</p>
      </EmptyState>
    );
  }

  if (state === "generating" || !worn) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-[10px] border border-solid border-border-default bg-surface-track">
        {/* 동기 요청이라 진행률을 알 수 없다 — 불확정 막대로 둔다 */}
        <ProgressBar label="착용 이미지를 만드는 중" />
      </div>
    );
  }

  // ready — 조작 요소는 전부 무대 바깥 아래에 둔다
  return (
    <>
      <img
        src={worn.imageUrl}
        alt=""
        className="min-h-px w-full flex-1 border border-solid border-border-default bg-surface-base object-contain"
      />
      <p className="text-body text-text-primary">{worn.name}</p>
      {worn.size ? (
        <div className="flex gap-[6px]">
          <SpecTag>{worn.size}</SpecTag>
        </div>
      ) : null}
      <div className="flex items-center gap-[10px]">
        <OutlineButton type="button" onClick={onRegenerate}>
          다시 만들기
        </OutlineButton>
        <IconButton type="button" aria-label="선택 해제" onClick={onClear}>
          ×
        </IconButton>
      </div>
    </>
  );
}
