/** 제품 엔드포인트. */
import { apiFetch } from "./client.server";
import type { ProductPage } from "./types";

/** 백엔드 `page` 는 0부터 센다. 화면의 1부터 세는 쪽과 섞이지 않게 여기서만 다룬다. */
export function getProducts(
  token: string,
  { page, size }: { page: number; size: number },
) {
  const query = new URLSearchParams({
    page: String(page - 1),
    size: String(size),
  });

  return apiFetch<ProductPage>(`/api/v1/products?${query}`, { token });
}
