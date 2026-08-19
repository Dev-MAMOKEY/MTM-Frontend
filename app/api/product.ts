/**
 * 백엔드 `ProductResponse` 를 화면이 쓸 모양으로 좁힌다.
 *
 * 생성된 타입은 필드가 전부 optional 이다(백엔드 응답 DTO 에 `required` 가 없다).
 * 화면마다 `?? ""` 를 뿌리면 데이터가 실제로 비었을 때 빈 문자열로 조용히 넘어가
 * 이름 없는 타일이 뜬다. 경계 한 곳에서 확인하고, 화면에는 확실한 값만 넘긴다.
 */
import type { Product, ProductDetail, WearType } from "./types";

export type ListedProduct = {
  id: number;
  sku?: string;
  name: string;
  /** 포맷까지 끝낸 문자열. 통화가 없으면 `undefined`. */
  price?: string;
  /** 착용 방식. 필터가 없는 목록에서 제품을 구분하는 단서다(UX 감사 U6). */
  wearType?: string;
  imageUrl?: string;
};

/**
 * `1250` + `USD` → `$1,250`. 소수점은 버린다 — 시안의 가격이 전부 정수다.
 * 통화가 KRW 면 `₩1,250,000` 이 된다.
 */
export function formatPrice(
  price: number,
  currency: NonNullable<Product["currency"]>,
) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(price);
}

/** 백엔드 enum 을 화면 말로 옮긴다. 시안의 표기를 그대로 쓴다. */
const WEAR_TYPE_LABEL: Record<WearType, string> = {
  ONE_SHOULDER: "한쪽 어깨",
  CROSSBODY: "크로스백",
  IN_HAND: "손에 듦",
  WAIST: "허리",
  BESIDE: "옆에 세움",
};

/**
 * `id` 나 `name` 이 없는 항목은 뺀다 — 이름 없이 그릴 수도, id 없이 상세로 보낼 수도 없다.
 * 가격과 이미지는 없어도 타일이 성립하므로 그대로 통과시킨다.
 */
export function toListedProducts(raw: Product[]): ListedProduct[] {
  return raw.flatMap((product) => {
    if (product.id == null || !product.name) {
      return [];
    }

    return [
      {
        id: product.id,
        sku: product.sku,
        name: product.name,
        price:
          product.price != null && product.currency
            ? formatPrice(product.price, product.currency)
            : undefined,
        wearType: product.wearType
          ? WEAR_TYPE_LABEL[product.wearType]
          : undefined,
        imageUrl: product.frontCutUrl,
      },
    ];
  });
}

export type DetailCut = { id: number; imageUrl: string };

export type ProductDetailView = {
  id: number;
  name: string;
  price?: string;
  wearType?: string;
  description?: string;
  /** `가로` · `세로` · `깊이`. 값이 없는 줄은 아예 빠진다. */
  dimensions: { label: string; value: string }[];
  /** 착용 화면의 한 줄 표기 `14.2 × 11.8 IN`. 가로·세로가 다 있어야 만든다. */
  sizeLabel?: string;
  cuts: DetailCut[];
  /** `cuts` 안에서 처음 보여줄 컷의 위치. 정면 컷이 있으면 그것. */
  initialCut: number;
};

/** 인치를 시안 표기(`14.2 in  (36.1 cm)`)로 옮긴다. API 가 cm 를 주지 않아 환산한다. */
function formatLength(inches: number) {
  return `${inches.toFixed(1)} in  (${(inches * 2.54).toFixed(1)} cm)`;
}

function toDimensionRows(dimensions: ProductDetail["dimensions"]) {
  // 시안에는 스트랩 줄도 있지만 DimensionsResponse 에 없다. 세 줄만 그린다.
  const rows: [string, number | undefined][] = [
    ["가로", dimensions?.widthIn],
    ["세로", dimensions?.heightIn],
    ["깊이", dimensions?.depthIn],
  ];

  return rows.flatMap(([label, value]) =>
    value == null ? [] : [{ label, value: formatLength(value) }],
  );
}

/**
 * 상세 응답을 화면 모양으로 좁힌다. 목록의 `toListedProducts` 와 같은 이유다.
 *
 * `id` 나 `name` 이 없으면 그릴 게 없다고 보고 `null` 을 돌려준다 — 부르는 쪽에서
 * 조회 실패와 같이 다룬다.
 */
export function toProductDetail(raw: ProductDetail): ProductDetailView | null {
  if (raw.id == null || !raw.name) {
    return null;
  }

  // 이미지 없는 컷은 썸네일로 그릴 수 없다. slotNo 순서를 백엔드가 보장하지 않아 여기서 세운다.
  const cuts = (raw.productCuts ?? [])
    .filter((cut): cut is typeof cut & { id: number; imageUrl: string } =>
      cut.id != null && !!cut.imageUrl,
    )
    .sort((a, b) => (a.slotNo ?? 0) - (b.slotNo ?? 0));

  const frontIndex = cuts.findIndex((cut) => cut.frontSlot);

  return {
    id: raw.id,
    name: raw.name,
    price:
      raw.price != null && raw.currency
        ? formatPrice(raw.price, raw.currency)
        : undefined,
    wearType: raw.wearType ? WEAR_TYPE_LABEL[raw.wearType] : undefined,
    description: raw.description || undefined,
    dimensions: toDimensionRows(raw.dimensions),
    sizeLabel:
      raw.dimensions?.widthIn != null && raw.dimensions.heightIn != null
        ? `${raw.dimensions.widthIn.toFixed(1)} × ${raw.dimensions.heightIn.toFixed(1)} IN`
        : undefined,
    cuts: cuts.map((cut) => ({ id: cut.id, imageUrl: cut.imageUrl })),
    initialCut: frontIndex === -1 ? 0 : frontIndex,
  };
}
