# MTM Frontend

MCM 제품 가상 착용 서비스 — 프런트엔드

전신 사진을 한 번 올려 **기준 이미지**(정자세·흰 배경)로 변환해 두면, 제품을 고를 때마다 그 위에 제품이 올라간 **착용 이미지**를 만들어 보여준다.

```
사진 올리기 ──▶ 기준 이미지 만들기 ──▶ 제품 고르기 ──▶ 착용 이미지
 /photos          /photos · /            /  ·  /products      /
```

- 백엔드: [Dev-MAMOKEY/MTM-backend](https://github.com/Dev-MAMOKEY/MTM-backend)
- 와이어프레임: [`docs/design/WIREFRAME.md`](./docs/design/WIREFRAME.md) — 화면 구조·상태·UX 감사
- 화면 미리보기: [`docs/design/previews/wireframe-all.html`](./docs/design/previews/wireframe-all.html)

**라우트 구성과 각 화면의 동작은 와이어프레임 문서를 기준으로 한다.**

---

## 기술 스택

| 구분 | 기술 | 버전 |
|---|---|---|
| Language | TypeScript (strict) | 5.9 |
| Framework | React Router (framework mode, SSR) | 8 |
| UI | React | 19 |
| Build | Vite | 8 |
| Styling | Tailwind CSS | 4 |
| API 타입 | openapi-typescript | 7 |
| 배포 | Vercel | - |

Node.js **22.22.0 이상**이 필요하다(React Router 8 요구 사항). 낮은 버전에서는 `npm run typecheck` 가 막히고 실행 시 경고가 뜬다.

---

## 프로젝트 구조

```
app
├── root.tsx                    전역 레이아웃 · ErrorBoundary · 인증 middleware
├── routes.ts                   라우트 정의
├── app.css                     Tailwind 진입점 · 디자인 토큰
│
├── api                         백엔드 연동 — 화면이 백엔드를 직접 알지 않게 하는 경계
│   ├── schema.d.ts             생성물. 직접 고치지 않는다
│   ├── types.ts                화면이 쓸 이름만 재수출
│   ├── product.ts              응답 → 화면 모양 변환 (.server 아님 — 화면도 쓴다)
│   ├── photo.ts                업로드 제약 (화면·서버가 같은 목록을 본다)
│   ├── env.server.ts           서버 전용 환경변수
│   ├── client.server.ts        fetch 래퍼 · 401 재발급 · 개발용 로그
│   ├── session.server.ts       쿠키 세션 · requireAuth
│   └── *.server.ts             엔드포인트별 호출 (auth · members · photos · products · base-images · worn-images)
│
├── routes                      화면
│   ├── home.tsx                착용 화면 — Z1 사진 · Z2 무대 · Z3 제품
│   ├── login.tsx · signup.tsx · logout.tsx
│   ├── profile.tsx             신체 정보 (첫 로그인 강제 진입)
│   ├── photos.tsx              사진첩
│   └── products._index.tsx · products.$id.tsx
│
└── components                  시안의 컴포넌트 (Figma 8-24 디자인 시스템)
```

`.server.ts` 접미사가 붙은 모듈은 **클라이언트 번들에서 제외된다.** 백엔드 주소와 토큰이 브라우저로 새지 않게 하는 장치이므로, 서버에서만 도는 코드에는 반드시 붙인다.

경로 별칭 `~/*` 는 `app/*` 를 가리킨다.

---

## 라우트

| 경로 | 화면 | 로그인 필요 |
|---|---|---|
| `/` | 착용 화면 | O |
| `/login` · `/signup` | 로그인 · 가입 | X |
| `/logout` | 세션 삭제 (POST 전용) | - |
| `/profile` | 신체 정보 | O |
| `/photos` | 사진첩 | O |
| `/products` | 제품 목록 | O |
| `/products/:id` | 제품 상세 | O |

신체 정보가 없는 계정이 `/` 에 들어오면 `/profile?setup=1` 로 보낸다. 착용 이미지는 키·몸무게 없이 만들 수 없다.

---

## 실행 방법

```bash
npm install
cp .env.example .env   # 백엔드 주소를 채운다
npm run dev
```

`http://localhost:5173` 에서 열린다.

### 환경 변수

`.env` 는 커밋하지 않는다. 키 이름과 형식은 `.env.example` 에만 둔다.

| 이름 | 쓰이는 곳 |
|---|---|
| `API_BASE_URL` | 런타임. loader·action 이 백엔드를 부를 주소 |
| `SESSION_SECRET` | 런타임. 세션 쿠키 서명 키 |
| `API_DOCS_URL` | **빌드 전용.** `npm run gen:api` 만 쓴다 |

**`VITE_` 접두사를 쓰지 않는다.** 접두사가 붙은 값은 클라이언트 번들에 문자열로 박혀 브라우저에 노출된다. 백엔드 호출은 loader(서버)에서 돌므로 접두사가 필요 없다.

`SESSION_SECRET` 은 아무 긴 무작위 문자열이면 된다. **바꾸면 기존 로그인이 전부 풀린다**(쿠키 서명이 깨진다).

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 스크립트

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 (HMR) |
| `npm run build` | 프로덕션 빌드 → `build/` |
| `npm start` | 빌드 결과물 서빙 |
| `npm run typecheck` | 라우트 타입 생성 후 `tsc` 검사 |
| `npm run gen:api` | Swagger 문서에서 API 타입 생성 |

---

## API 타입

백엔드 스키마는 Swagger(OpenAPI) 문서에서 **생성**한다. 손으로 적으면 백엔드가 필드를 바꿔도 프런트 타입은 그대로라, **컴파일은 통과하는데 런타임에 `undefined`** 가 나온다.

```bash
npm run gen:api        # .env 의 API_DOCS_URL 을 읽어 app/api/schema.d.ts 생성
```

- **`schema.d.ts` 는 커밋한다.** 백엔드를 띄우지 않아도 CI 와 동료가 타입 검사를 할 수 있어야 한다.
- **화면 코드는 `schema.d.ts` 를 직접 import 하지 않는다.** `types.ts` 를 거친다. 백엔드가 DTO 이름을 바꿔도 고칠 곳이 한 파일로 모인다.
- 응답 DTO 에 `required` 가 없어 **모든 필드가 optional** 이다. `product.ts` 의 변환 함수가 경계에서 한 번 좁히고, 화면에는 확실한 값만 넘긴다.

---

## 인증

토큰은 **httpOnly 쿠키 세션**에만 둔다.

- `localStorage` 는 스크립트로 읽힌다. XSS 한 번에 털린다.
- loader 는 서버에서 도는데 서버는 `localStorage` 를 못 읽는다. 첫 렌더에 토큰이 없어 SSR 이 성립하지 않는다.

액세스 토큰이 만료되면 백엔드가 401 을 주고, `requireAuth` 가 리프레시 토큰으로 새 토큰을 받아 **같은 요청을 한 번만** 다시 보낸다. 재발급된 토큰을 쿠키에 다시 굽는 자리는 `root.tsx` 의 middleware 다 — `Set-Cookie` 를 붙일 곳은 응답이라 loader 안에서는 붙일 수 없다.

---

## 배포

Vercel 에 올린다. **환경변수를 먼저 넣어야 한다.** Vercel 은 Production · Preview · Development 를 따로 관리하므로, 쓰는 환경마다 넣는다.

| 이름 | 값 |
|---|---|
| `API_BASE_URL` | 백엔드 주소. **백엔드가 평문 HTTP 면 `http://` 로 넣는다** |
| `SESSION_SECRET` | 무작위 문자열. 로컬과 다른 값을 쓴다 |

### 겪은 두 가지

- **`FUNCTION_INVOCATION_FAILED`** — 환경변수가 없다. 값이 없으면 모듈이 로드되는 순간 던지도록 만들어 뒀다. 그대로 두면 요청 때 `undefined/products` 로 조용히 404 가 나서 원인을 찾을 수 없다.
- **`SSL routines::wrong version number`** — `API_BASE_URL` 이 `https://` 인데 백엔드가 그 포트에서 평문 HTTP 를 쓴다. **Vercel 이 HTTPS 라도 `http://` 백엔드를 부를 수 있다** — 혼합 콘텐츠는 브라우저 규칙이고 이 호출은 서버가 한다.

`@vercel/react-router` 어댑터는 쓰지 않는다. 없이도 뜨고, 그 패키지는 React Router 7 까지만 지원한다.

---

## 팀 컨벤션

### 브랜치 전략

| 브랜치 | 용도 |
|---|---|
| `main` | 배포 |
| `develop` | 통합. **PR 은 여기로 보낸다** |
| `{라벨}/#{이슈번호}` | 작업 브랜치. 예) `feat/#3` |

**이슈 하나당 브랜치 하나.** 작업 브랜치는 `develop` 에서 따고 PR 도 `develop` 으로 보낸다.

### 커밋 메시지

```
[{브랜치명}] {라벨}: {한글 설명}
```

```
[feat/#6] feat: 제품을 고르면 착용 이미지가 만들어진다
[fix/#50] fix: 사진이 없을 때 착용 이미지 로딩바가 도는 것을 고친다
[design/#54] design: 제품 타일에 착용 방식 태그를 되살린다
```

| 라벨 | 의미 |
|---|---|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변화 없는 구조 개선 |
| `design` | 화면·시안 반영 |
| `chore` | 빌드·의존성·설정 |
| `docs` | 문서 |

**커밋은 의미 단위로 잘게 쪼갠다.** 하나를 되돌려도 나머지가 성립해야 한다. 생성물(`schema.d.ts`)과 문서는 코드와 섞지 않고 따로 커밋한다.

**본문에는 무엇을 했는지가 아니라 왜 그렇게 했는지를 쓴다.** 무엇은 diff 가 이미 말해준다.

### 이슈·PR 양식

이슈는 `.github/ISSUE_TEMPLATE/issue.md` 를 따른다 — 목적 / 범위(포함·제외) / 작업 내용 / 완료 조건.

PR 은 `## 연관 Issue` · `## 요약` · `## 변경 사항` 으로 시작한다. **`closes #N` 을 걸어 머지 시 이슈가 닫히게 한다.** 다만 완료 조건이 남아 있으면 `관련 #N` 으로 적고 닫히지 않게 둔다.

---

## 코드 컨벤션

### 서버와 화면의 경계

- 백엔드 호출은 **loader · action 에서만** 한다. 컴포넌트에서 `fetch` 하지 않는다.
- 서버에서만 도는 모듈에는 `.server.ts` 를 붙인다.
- 화면이 쓰는 타입은 `api/types.ts` 를 거친다.

### 상태

- 고른 값은 주소에 둔다(`?photo=` · `?product=`). 새로고침해도 남고 링크로 공유된다.

### 디자인

- 색·타이포는 `app.css` 의 `@theme` 토큰을 쓴다. 이름이 Figma 변수명과 1:1 이라 대조에 머리를 쓸 일이 없다.
- 폭은 `max-w-page`(1440). 값은 `--container-page` 한 줄이다.
- **시안과 다르게 갈 때는 이유를 주석으로 남긴다.** 나중에 대조하는 사람이 실수인지 판단인지 알 수 있어야 한다.
- 크기를 인라인 `style` 로 주지 않는다. 화면 폭에 따라 바꿀 수 없다.

### 용어

백엔드의 `CONTEXT.md` 용어를 따른다. 변수명·주석·커밋 메시지 전부 해당된다.

| 쓸 것 | 쓰지 말 것 |
|---|---|
| 원본 사진 `Photo` | 업로드 이미지, 유저 이미지 |
| 기준 이미지 `BaseImage` | 정자세 이미지, 누끼 이미지 |
| 착용 이미지 `WornImage` | 결과 이미지, 합성 이미지, 룩 |
| 제품 컷 `ProductCut` | 상품 이미지 |
| 실측 치수 `Dimensions` | 사이즈 |
| 착용 방식 `WearType` | 가방 타입, 카테고리 |
| 사진첩 | 갤러리, 앨범 |
