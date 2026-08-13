/** 목록 API(슬라이스 1)가 붙기 전까지 쓰는 목 데이터. Figma 시안의 값 그대로다. */
export type Product = {
  sku: string;
  name: string;
  price: string;
};

export const products: Product[] = [
  { sku: "aren-zip-hobo", name: "Aren Zip Hobo", price: "$1,250" },
  {
    sku: "long-name-sample",
    name: "아주 긴 한국어 제품명이 들어오면 한 줄로 잘린다",
    price: "$980",
  },
  { sku: "stark-backpack", name: "Stark Backpack", price: "$890" },
  { sku: "liz-shopper", name: "Liz Shopper", price: "$1,050" },
  { sku: "himmel-tote", name: "Himmel Tote", price: "$760" },
  { sku: "klara-hobo", name: "Klara Hobo", price: "$1,120" },
];

export const totalProductCount = 128;
