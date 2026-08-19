/** 제품 엔드포인트. */
import type { Auth } from "./session.server";
import type { ProductDetail, ProductPage } from "./types";

/** 백엔드 `page` 는 0부터 센다. 화면의 1부터 세는 쪽과 섞이지 않게 여기서만 다룬다. */
export function getProducts(
  auth: Auth,
  { page, size }: { page: number; size: number }) {
  const query = new URLSearchParams({
    page: String(page - 1),
    size: String(size),
  });

  return auth.fetch<ProductPage>(`/api/v1/products?${query}`);
}

export function getProduct(auth: Auth, id: number) {
  return auth.fetch<ProductDetail>(`/api/v1/products/${id}`);
}
