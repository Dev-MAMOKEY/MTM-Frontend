import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MTM" },
    { name: "description", content: "내 사진 위에서 MCM 제품을 입어봅니다." },
  ];
}

export default function Home() {
  // 착용 화면(WIREFRAME.md `/`)은 별도 슬라이스 이슈에서 구현한다.
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>MTM</h1>
    </main>
  );
}
