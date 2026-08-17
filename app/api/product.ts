/**
 * 백엔드 `ProductResponse` 를 화면이 쓸 모양으로 좁힌다.
 *
 * 생성된 타입은 필드가 전부 optional 이다(백엔드 응답 DTO 에 `required` 가 없다).
 * 화면마다 `?? ""` 를 뿌리면 데이터가 실제로 비었을 때 빈 문자열로 조용히 넘어가
 * 이름 없는 타일이 뜬다. 경계 한 곳에서 확인하고, 화면에는 확실한 값만 넘긴다.
 */
import type { Product } from "./types";

export type ListedProduct = {
  id: number;
  sku?: string;
  name: string;
  /** 포맷까지 끝낸 문자열. 통화가 없으면 `undefined`. */
  price?: string;
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
        imageUrl: product.frontCutUrl,
      },
    ];
  });
}
