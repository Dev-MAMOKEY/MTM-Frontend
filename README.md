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

Node.js 20 이상이 필요하다.

```bash
npm install
npm run dev
```

`http://localhost:5173` 에서 열린다.

## 스크립트

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 (HMR) |
| `npm run build` | 프로덕션 빌드 → `build/` |
| `npm start` | 빌드 결과물 서빙 |
| `npm run typecheck` | 라우트 타입 생성 후 `tsc` 검사 |

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
