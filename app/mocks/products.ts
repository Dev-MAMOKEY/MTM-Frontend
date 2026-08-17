/**
 * 목 데이터. Figma 시안의 값 그대로다.
 *
 * 제품 목록 화면(`/products`)은 #1에서 실제 API 로 갈아탔다. **남은 사용처는
 * 착용 화면(`/`)의 Z3 타일 하나뿐**이고, 그건 슬라이스 6에서 걷어낸다.
 *
 * 실제 스키마(`app/api/product.ts` 의 `ListedProduct`)와 다르다는 점에 주의한다 —
 * 가격이 여기서는 포맷된 문자열(`"$1,250"`)이고, `id` 와 이미지가 없다.
 */
export type Product = {
  sku: string;
  name: string;
  price: string;
};

export const products: Product[] = [
  {
    sku: "aren-zip-hobo",
    name: "Aren Zip Hobo in Visetos",
    price: "$1,250",
  },
  {
    sku: "long-name-sample",
    name: "아주 긴 한국어 제품명이 들어왔을 때 한 줄로 잘리는지 보는 타일",
    price: "$980",
  },
  {
    sku: "stark-side-studs-backpack",
    name: "Stark Side Studs Backpack",
    price: "$890",
  },
  {
    sku: "liz-shopper",
    name: "Liz Shopper",
    price: "$1,050",
  },
  {
    sku: "himmel-tote",
    name: "Himmel Tote",
    price: "$760",
  },
  { sku: "aren-belt-bag", name: "Aren Belt Bag", price: "$540" },
  {
    sku: "trolley-carry-on",
    name: "Trolley Carry-On",
    price: "$1,890",
  },
  {
    sku: "klara-hobo",
    name: "Klara Hobo",
    price: "$1,120",
  },
  {
    sku: "mode-travia-drawstring",
    name: "Mode Travia Drawstring",
    price: "$1,340",
  },
  {
    sku: "dessau-weekender",
    name: "Dessau Weekender",
    price: "$1,690",
  },
  {
    sku: "ottomar-boston",
    name: "Ottomar Boston",
    price: "$1,180",
  },
  { sku: "aren-pouch", name: "Aren Pouch", price: "$390" },
];

export const totalProductCount = 128;

/** 128 ÷ 32가 딱 떨어져 마지막 페이지가 비지 않는다. */
export const pageSize = 32;
export const totalPages = Math.ceil(totalProductCount / pageSize);
