/**
 * 이 파일은 자동 생성된다. 직접 수정하지 않는다.
 * 백엔드 스키마가 바뀌면 `npm run gen:api` 로 다시 만든다.
 *
 * 화면 코드는 이 파일을 직접 import 하지 않는다. `app/api/types.ts` 를 거친다.
 */

export interface paths {
    "/api/v1/photos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 내 사진첩 조회
         * @description 로그인한 회원이 업로드한 원본 사진 목록을 최신순으로 반환한다.
         */
        get: operations["getMyPhotos"];
        put?: never;
        /**
         * 원본 사진 업로드
         * @description 로그인한 회원의 전신 사진을 저장하고 사진첩에 등록한다.
         */
        post: operations["uploadPhoto"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/photos/{photoId}/base-image": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 기준 이미지 생성
         * @description 원본 사진을 정자세와 불투명 흰 배경의 기준 이미지로 변환한다.
         */
        post: operations["createBaseImage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/photos/{photoId}/base-image/regenerate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 기준 이미지 재생성
         * @description 원본 사진을 그대로 둔 채 기준 이미지만 다시 만든다. 재생성하면 그 기준 이미지에 딸린 착용 이미지가 모두 함께 삭제된다.
         */
        post: operations["regenerateBaseImage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/members/me/body-info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 신체 정보 저장
         * @description 키와 몸무게를 저장한다. 둘 다 필수이며, 이미 값이 있으면 새 값으로 교체된다.
         */
        post: operations["saveBodyInfo"];
        delete?: never;
        options?: never;
        head?: never;
        /**
         * 신체 정보 수정
         * @description 프로필에서 키 또는 몸무게를 수정한다. 보내지 않은 값은 기존 값을 유지한다.
         */
        patch: operations["updateBodyInfo"];
        trace?: never;
    };
    "/api/v1/base-images/{baseImageId}/worn-images": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 착용 이미지 생성
         * @description 기준 이미지와 선택한 제품의 정면 제품 컷을 사용해 착용 이미지를 생성하고 저장한다. 이미 같은 조합(기준 이미지, 제품)의 착용 이미지가 있으면 새로 생성하지 않고 저장된 것을 즉시 반환한다.
         */
        post: operations["createWornImage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/base-images/{baseImageId}/worn-images/regenerate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 착용 이미지 재생성
         * @description 이미 만든 (기준 이미지, 제품) 조합의 착용 이미지를 새로 생성해 기존 것을 교체한다. 새 행을 만들지 않고 저장된 착용 이미지를 교체하며, 다시 만들 대상이 없으면 실패한다.
         */
        post: operations["regenerateWornImage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/signup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 회원가입
         * @description 이메일과 비밀번호로 가입한다. 비밀번호는 해시로 저장된다.
         */
        post: operations["signup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/reissue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 액세스 토큰 재발급
         * @description 리프레시 토큰으로 새 액세스 토큰을 받는다. 리프레시 토큰은 그대로 유지된다.
         */
        post: operations["reissue"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 로그인
         * @description 액세스 토큰과 리프레시 토큰을 발급한다.
         */
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 제품 목록 조회
         * @description 적재된 MCM 제품을 페이지 단위로 돌려준다. page는 0부터 시작하며, size는 최대 100까지 허용된다. 대표 이미지 URL은 유효기간 30분의 Presigned URL이라 오래 캐시하면 안 된다.
         */
        get: operations["getProducts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/products/{productId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 제품 상세 조회
         * @description 제품 하나의 색상·설명·실측 치수·착용 방식과 제품 컷 전체를 돌려준다. 이미지 URL은 유효기간 30분의 Presigned URL이라 오래 캐시하면 안 된다.
         */
        get: operations["getProduct"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/members/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 내 정보 조회
         * @description 액세스 토큰으로 식별된 회원의 정보를 돌려준다.
         */
        get: operations["getMyInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ErrorInfo: {
            code?: string;
            message?: string;
        };
        PhotoResponse: {
            /** Format: int64 */
            id?: number;
            imageUrl?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        RsDataPhotoResponse: {
            success?: boolean;
            data?: components["schemas"]["PhotoResponse"];
            error?: components["schemas"]["ErrorInfo"];
            /** Format: date-time */
            timestamp?: string;
        };
        BaseImageResponse: {
            /** Format: int64 */
            id?: number;
            /** Format: int64 */
            photoId?: number;
            imageUrl?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        RsDataBaseImageResponse: {
            success?: boolean;
            data?: components["schemas"]["BaseImageResponse"];
            error?: components["schemas"]["ErrorInfo"];
            /** Format: date-time */
            timestamp?: string;
        };
        BodyInfoRequestDTO: {
            heightCm: number;
            weightKg: number;
        };
        MemberResponseDTO: {
            /** Format: int64 */
            id?: number;
            email?: string;
            heightCm?: number;
            weightKg?: number;
        };
        RsDataMemberResponseDTO: {
            success?: boolean;
            data?: components["schemas"]["MemberResponseDTO"];
            error?: components["schemas"]["ErrorInfo"];
            /** Format: date-time */
            timestamp?: string;
        };
        WornImageCreateRequest: {
            /** Format: int64 */
            productId: number;
        };
        RsDataWornImageResponse: {
            success?: boolean;
            data?: components["schemas"]["WornImageResponse"];
            error?: components["schemas"]["ErrorInfo"];
            /** Format: date-time */
            timestamp?: string;
        };
        WornImageResponse: {
            /** Format: int64 */
            id?: number;
            /** Format: int64 */
            baseImageId?: number;
            /** Format: int64 */
            productId?: number;
            /** Format: int64 */
            productCutId?: number;
            imageUrl?: string;
            /** @enum {string} */
            generator?: "GEMINI" | "OPENAI" | "FAKE";
            /** Format: date-time */
            createdAt?: string;
        };
        SignupRequestDTO: {
            /** Format: email */
            email: string;
            password: string;
        };
        RsDataString: {
            success?: boolean;
            data?: string;
            error?: components["schemas"]["ErrorInfo"];
            /** Format: date-time */
            timestamp?: string;
        };
        TokenReissueRequestDTO: {
            refreshToken: string;
        };
        RsDataTokenResponseDTO: {
            success?: boolean;
            data?: components["schemas"]["TokenResponseDTO"];
            error?: components["schemas"]["ErrorInfo"];
            /** Format: date-time */
            timestamp?: string;
        };
        TokenResponseDTO: {
            accessToken?: string;
            refreshToken?: string;
        };
        LoginRequestDTO: {
            /** Format: email */
            email: string;
            password: string;
        };
        BodyInfoUpdateRequestDTO: {
            heightCm?: number;
            weightKg?: number;
            anyValuePresent?: boolean;
        };
        PageResponseDTOProductResponse: {
            content?: components["schemas"]["ProductResponse"][];
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            /** Format: int64 */
            totalElements?: number;
            /** Format: int32 */
            totalPages?: number;
            first?: boolean;
            last?: boolean;
        };
        ProductResponse: {
            /** Format: int64 */
            id?: number;
            sku?: string;
            name?: string;
            price?: number;
            /** @enum {string} */
            currency?: "KRW" | "USD";
            frontCutUrl?: string;
        };
        RsDataPageResponseDTOProductResponse: {
            success?: boolean;
            data?: components["schemas"]["PageResponseDTOProductResponse"];
            error?: components["schemas"]["ErrorInfo"];
            /** Format: date-time */
            timestamp?: string;
        };
        DimensionsResponse: {
            depthIn?: number;
            widthIn?: number;
            heightIn?: number;
        };
        ProductCutResponse: {
            /** Format: int64 */
            id?: number;
            /** Format: int32 */
            slotNo?: number;
            frontSlot?: boolean;
            wornSlot?: boolean;
            imageUrl?: string;
        };
        ProductDetailResponse: {
            /** Format: int64 */
            id?: number;
            sku?: string;
            name?: string;
            color?: string;
            price?: number;
            /** @enum {string} */
            currency?: "KRW" | "USD";
            description?: string;
            dimensions?: components["schemas"]["DimensionsResponse"];
            /** @enum {string} */
            wearType?: "ONE_SHOULDER" | "CROSSBODY" | "IN_HAND" | "WAIST" | "BESIDE";
            detailUrl?: string;
            productCuts?: components["schemas"]["ProductCutResponse"][];
        };
        RsDataProductDetailResponse: {
            success?: boolean;
            data?: components["schemas"]["ProductDetailResponse"];
            error?: components["schemas"]["ErrorInfo"];
            /** Format: date-time */
            timestamp?: string;
        };
        RsDataListPhotoResponse: {
            success?: boolean;
            data?: components["schemas"]["PhotoResponse"][];
            error?: components["schemas"]["ErrorInfo"];
            /** Format: date-time */
            timestamp?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getMyPhotos: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataListPhotoResponse"];
                };
            };
            /** @description 토큰이 없거나 만료됨 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataListPhotoResponse"];
                };
            };
        };
    };
    uploadPhoto: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: string;
                };
            };
        };
        responses: {
            /** @description 업로드 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataPhotoResponse"];
                };
            };
            /** @description 파일이 비었거나 이미지 파일이 아님 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataPhotoResponse"];
                };
            };
            /** @description 토큰이 없거나 만료됨 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataPhotoResponse"];
                };
            };
            /** @description 이미지 저장 실패 */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataPhotoResponse"];
                };
            };
        };
    };
    createBaseImage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                photoId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 생성 성공 또는 기존 기준 이미지 반환 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataBaseImageResponse"];
                };
            };
            /** @description 회원 신체 정보가 없음 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataBaseImageResponse"];
                };
            };
            /** @description 토큰이 없거나 만료됨 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataBaseImageResponse"];
                };
            };
            /** @description 원본 사진이 없거나 본인 소유가 아님 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataBaseImageResponse"];
                };
            };
            /** @description 이미지 생성 모델 호출 실패 */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataBaseImageResponse"];
                };
            };
        };
    };
    regenerateBaseImage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                photoId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 재생성 성공, 교체된 기준 이미지를 반환 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataBaseImageResponse"];
                };
            };
            /** @description 회원 신체 정보가 없음 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataBaseImageResponse"];
                };
            };
            /** @description 토큰이 없거나 만료됨 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataBaseImageResponse"];
                };
            };
            /** @description 원본 사진이 없거나 본인 소유가 아니거나, 다시 만들 기준 이미지가 없음 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataBaseImageResponse"];
                };
            };
            /** @description 이미지 생성 모델 호출 실패 */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataBaseImageResponse"];
                };
            };
        };
    };
    saveBodyInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BodyInfoRequestDTO"];
            };
        };
        responses: {
            /** @description 저장 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataMemberResponseDTO"];
                };
            };
            /** @description 값이 비었거나 범위를 벗어남 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataMemberResponseDTO"];
                };
            };
            /** @description 토큰이 없거나 만료됨 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataMemberResponseDTO"];
                };
            };
        };
    };
    updateBodyInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BodyInfoUpdateRequestDTO"];
            };
        };
        responses: {
            /** @description 수정 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataMemberResponseDTO"];
                };
            };
            /** @description 둘 다 비었거나 범위를 벗어남 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataMemberResponseDTO"];
                };
            };
            /** @description 토큰이 없거나 만료됨 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataMemberResponseDTO"];
                };
            };
        };
    };
    createWornImage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                baseImageId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WornImageCreateRequest"];
            };
        };
        responses: {
            /** @description 생성 성공 또는 이미 생성된 착용 이미지를 즉시 반환 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
            /** @description 신체 정보, 제품 실측 치수 또는 착용 방식이 없음 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
            /** @description 토큰이 없거나 만료됨 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
            /** @description 기준 이미지, 제품 또는 제품 컷이 없거나 기준 이미지가 본인 소유가 아님 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
            /** @description 동시 요청으로 동일 조합이 먼저 저장되어 충돌함(드묾) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
            /** @description 이미지 저장 실패 */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
            /** @description 이미지 생성 모델 호출 실패 */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
        };
    };
    regenerateWornImage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                baseImageId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WornImageCreateRequest"];
            };
        };
        responses: {
            /** @description 재생성 성공, 교체된 착용 이미지를 반환 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
            /** @description 신체 정보, 제품 실측 치수 또는 착용 방식이 없음 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
            /** @description 토큰이 없거나 만료됨 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
            /** @description 기준 이미지·제품·제품 컷이 없거나, 다시 만들 착용 이미지가 없거나, 기준 이미지가 본인 소유가 아님 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
            /** @description 이미지 저장 실패 */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
            /** @description 이미지 생성 모델 호출 실패 */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataWornImageResponse"];
                };
            };
        };
    };
    signup: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SignupRequestDTO"];
            };
        };
        responses: {
            /** @description 가입 성공 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataString"];
                };
            };
            /** @description 이메일 형식 오류 또는 비밀번호 길이 위반 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataString"];
                };
            };
            /** @description 이미 가입된 이메일 */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataString"];
                };
            };
        };
    };
    reissue: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TokenReissueRequestDTO"];
            };
        };
        responses: {
            /** @description 재발급 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataTokenResponseDTO"];
                };
            };
            /** @description 리프레시 토큰이 만료되었거나 유효하지 않음 — 재로그인 필요 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataTokenResponseDTO"];
                };
            };
        };
    };
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequestDTO"];
            };
        };
        responses: {
            /** @description 로그인 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataTokenResponseDTO"];
                };
            };
            /** @description 이메일 또는 비밀번호 불일치 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataTokenResponseDTO"];
                };
            };
        };
    };
    getProducts: {
        parameters: {
            query?: {
                page?: number;
                size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataPageResponseDTOProductResponse"];
                };
            };
            /** @description 토큰이 없거나 만료됨 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataPageResponseDTOProductResponse"];
                };
            };
        };
    };
    getProduct: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                productId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataProductDetailResponse"];
                };
            };
            /** @description 토큰이 없거나 만료됨 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataProductDetailResponse"];
                };
            };
            /** @description 존재하지 않는 제품 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataProductDetailResponse"];
                };
            };
        };
    };
    getMyInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 성공 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataMemberResponseDTO"];
                };
            };
            /** @description 토큰이 없거나 만료됨 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["RsDataMemberResponseDTO"];
                };
            };
        };
    };
}
