/**
 * 화면 코드가 쓰는 API 타입.
 *
 * `schema.d.ts` 는 생성물이라 이름이 길고(`components["schemas"]["ProductResponse"]`)
 * 백엔드가 DTO 이름을 바꾸면 그 이름을 쓰던 파일이 전부 깨진다. 여기서 한 번 감싸두면
 * 스키마 이름이 바뀌어도 고칠 곳은 이 파일뿐이다.
 *
 * 화면 코드는 `schema.d.ts` 를 직접 import 하지 않는다.
 */
import type { components } from "./schema";

type Schemas = components["schemas"];

/**
 * 백엔드 공통 응답 봉투. 모든 엔드포인트가 실제 값을 `data` 에 넣어 감싼다.
 *
 * `success` · `error` · `timestamp` 는 생성된 타입에서 그대로 가져온다 — 봉투 모양이
 * 바뀌면 여기도 자동으로 따라간다.
 */
export type RsData<T> = Omit<Schemas["RsDataString"], "data"> & { data?: T };

export type ErrorInfo = Schemas["ErrorInfo"];

/* 응답 */
export type Product = Schemas["ProductResponse"];
/** 목록은 페이징된다 — 실제 항목은 `content` 안에 있다. */
export type ProductPage = Schemas["PageResponseDTOProductResponse"];
export type ProductDetail = Schemas["ProductDetailResponse"];
export type ProductCut = Schemas["ProductCutResponse"];
export type Dimensions = Schemas["DimensionsResponse"];
/** 착용 방식. 목록 응답에는 없고 상세 응답에만 있다. */
export type WearType = NonNullable<ProductDetail["wearType"]>;
export type Photo = Schemas["PhotoResponse"];
export type BaseImage = Schemas["BaseImageResponse"];
export type WornImage = Schemas["WornImageResponse"];
export type Member = Schemas["MemberResponseDTO"];
export type Token = Schemas["TokenResponseDTO"];

/* 요청 */
export type LoginRequest = Schemas["LoginRequestDTO"];
export type SignupRequest = Schemas["SignupRequestDTO"];
export type TokenReissueRequest = Schemas["TokenReissueRequestDTO"];
export type BodyInfoRequest = Schemas["BodyInfoRequestDTO"];
export type BodyInfoUpdateRequest = Schemas["BodyInfoUpdateRequestDTO"];
