/**
 * 목록 API(슬라이스 1)가 붙기 전까지 쓰는 목 데이터. Figma 시안의 값 그대로다.
 *
 * ⚠ 아래 타입은 실제 API 스키마(`app/api/types.ts` 의 `Product`)와 다르다.
 * `npm run gen:api` 로 받아온 `ProductResponse` 와 대조한 결과 — 교체는 #1에서 한다.
 *
 * | 목 | 실제 API | 메모 |
 * |---|---|---|
 * | `price: string` (`"$1,250"`) | `price: number` + `currency: "KRW" \| "USD"` | 포맷팅을 화면에서 해야 한다 |
 * | `carryMode: string` | **없음** | 백엔드에 착용 방식 필드가 없다 — `CarryModeTag` 가 채울 데이터가 없다 |
 * | 없음 | `id: number` | 상세 조회 키가 `sku` 가 아니라 `id` 일 수 있다 |
 * | 없음 | `frontCutUrl: string` | 제품 이미지. 지금 타일은 회색 박스다 |
 *
 * 게다가 `ProductResponse` 는 모든 필드가 optional 이라 그대로 쓰면 전부 `| undefined` 다.
 */
export type Product = {
  sku: string;
  name: string;
  price: string;
  carryMode: string;
};

export const products: Product[] = [
  {
    sku: "aren-zip-hobo",
    name: "Aren Zip Hobo in Visetos",
    price: "$1,250",
    carryMode: "한쪽 어깨",
  },
  {
    sku: "long-name-sample",
    name: "아주 긴 한국어 제품명이 들어왔을 때 한 줄로 잘리는지 보는 타일",
    price: "$980",
    carryMode: "크로스백",
  },
  {
    sku: "stark-side-studs-backpack",
    name: "Stark Side Studs Backpack",
    price: "$890",
    carryMode: "한쪽 어깨",
  },
  {
    sku: "liz-shopper",
    name: "Liz Shopper",
    price: "$1,050",
    carryMode: "손에 듦",
  },
  {
    sku: "himmel-tote",
    name: "Himmel Tote",
    price: "$760",
    carryMode: "한쪽 어깨",
  },
  { sku: "aren-belt-bag", name: "Aren Belt Bag", price: "$540", carryMode: "허리" },
  {
    sku: "trolley-carry-on",
    name: "Trolley Carry-On",
    price: "$1,890",
    carryMode: "옆에 세움",
  },
  {
    sku: "klara-hobo",
    name: "Klara Hobo",
    price: "$1,120",
    carryMode: "한쪽 어깨",
  },
  {
    sku: "mode-travia-drawstring",
    name: "Mode Travia Drawstring",
    price: "$1,340",
    carryMode: "한쪽 어깨",
  },
  {
    sku: "dessau-weekender",
    name: "Dessau Weekender",
    price: "$1,690",
    carryMode: "손에 듦",
  },
  {
    sku: "ottomar-boston",
    name: "Ottomar Boston",
    price: "$1,180",
    carryMode: "손에 듦",
  },
  { sku: "aren-pouch", name: "Aren Pouch", price: "$390", carryMode: "크로스백" },
];

export const totalProductCount = 128;

/** 128 ÷ 32가 딱 떨어져 마지막 페이지가 비지 않는다. */
export const pageSize = 32;
export const totalPages = Math.ceil(totalProductCount / pageSize);
