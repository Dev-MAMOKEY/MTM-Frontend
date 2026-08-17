/** 제품 엔드포인트. 상세 조회 API 는 아직 없다(⚠B3). */
import { apiFetch } from "./client.server";
import type { Product } from "./types";

export function getProducts(token: string) {
  return apiFetch<Product[]>("/api/v1/products", { token });
}
