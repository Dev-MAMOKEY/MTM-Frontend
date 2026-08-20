# MTM Frontend

MCM 제품을 **자기 사진 위에서** 입어보는 서비스의 프런트엔드.

전신 사진을 한 번 올려 **기준 이미지**로 변환해 두면, 이후 제품을 고를 때마다 그 위에 제품이
올라간 **착용 이미지**를 만들어 보여준다.

## 기술 스택

| 항목 | 버전 |
|---|---|
| React | 19 |
| React Router (framework mode, SSR) | 8 |
| Vite | 8 |
| Tailwind CSS | 4 |
| TypeScript (strict) | 5.9 |

## 시작하기

Node.js **22.22.0 이상**이 필요하다 (React Router 8 요구 사항). 낮은 버전에서는
`react-router` 실행 시 경고가 뜬다.

```bash
npm install
cp .env.example .env   # 백엔드 주소를 채운다
npm run dev
```

`http://localhost:5173` 에서 열린다.

`.env` 는 깃에 올리지 않는다. 키 이름과 형식은 `.env.example` 에만 둔다.

## 배포

Vercel 에 올린다. **환경변수를 먼저 넣어야 한다.**

| 이름 | 값 |
|---|---|
| `API_BASE_URL` | 백엔드 주소. **백엔드가 평문 HTTP 면 `http://` 로 넣는다** |
| `SESSION_SECRET` | 무작위 문자열. 로컬과 다른 값을 쓴다 |

`API_DOCS_URL` 은 넣지 않는다 — 타입 생성 스크립트만 쓰는 값이라 런타임에 필요 없다.

Vercel 은 Production · Preview · Development 를 따로 관리한다. 넣지 않은 환경은
서버가 뜨는 순간 예외를 던지고 `FUNCTION_INVOCATION_FAILED` 로 죽는다.

### 배포에서 겪은 두 가지

- **`FUNCTION_INVOCATION_FAILED`** — 환경변수가 없다. 값이 없으면 모듈이 로드되는
  순간 던지도록 만들어 뒀다. 그대로 두면 요청 때 `undefined/products` 로 조용히
  404 가 나서 원인을 찾을 수 없다.
- **`SSL routines::wrong version number`** — `API_BASE_URL` 이 `https://` 인데
  백엔드가 그 포트에서 평문 HTTP 를 쓴다. 백엔드 주소의 스킴을 맞춘다.
  Vercel 이 HTTPS 라도 `http://` 백엔드를 부를 수 있다 — 혼합 콘텐츠는 브라우저
  규칙이고, 이 호출은 서버가 한다.

## API 타입

백엔드 스키마는 Swagger(OpenAPI) 문서에서 **생성**한다. 손으로 적으면 백엔드가 필드를
바꿔도 프런트 타입은 그대로라, 컴파일은 통과하는데 런타임에 `undefined` 가 나온다.

```bash
npm run gen:api        # .env 의 API_DOCS_URL 을 읽어 app/api/schema.d.ts 생성
```

```
app/api/
├── schema.d.ts        생성물. 직접 수정하지 않는다
├── types.ts           화면이 쓸 이름만 재수출 — 화면 코드는 여기만 import 한다
├── client.server.ts   fetch 래퍼. loader · action 전용
└── env.server.ts      서버 전용 환경변수
```

`schema.d.ts` 는 커밋한다. 백엔드를 띄우지 않아도 CI 와 동료가 타입 검사를 할 수 있어야 한다.

## 스크립트

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 (HMR) |
| `npm run build` | 프로덕션 빌드 → `build/` |
| `npm start` | 빌드 결과물 서빙 |
| `npm run typecheck` | 라우트 타입 생성 후 `tsc` 검사 |
| `npm run gen:api` | Swagger 문서에서 API 타입 생성 → `app/api/schema.d.ts` |

## 디렉터리

```
app/
├── root.tsx        전역 레이아웃 · ErrorBoundary
├── routes.ts       라우트 정의
├── routes/         라우트 모듈
└── app.css         Tailwind 진입점 · 테마 토큰
docs/design/        와이어프레임 · 화면 설계
public/             정적 자산
```

경로 별칭 `~/*` 는 `app/*` 를 가리킨다.

## 설계 문서

- [와이어프레임](docs/design/WIREFRAME.md) — 화면 구조 · 라우트 목록 · 상태 · UX 감사
- [화면 미리보기](docs/design/previews/wireframe-all.html) — 모든 화면·상태를 한 파일에

라우트 구성과 각 화면의 동작은 와이어프레임 문서를 기준으로 한다.
