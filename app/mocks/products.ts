/** 목록 API(슬라이스 1)가 붙기 전까지 쓰는 목 데이터. Figma 시안의 값 그대로다. */
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
