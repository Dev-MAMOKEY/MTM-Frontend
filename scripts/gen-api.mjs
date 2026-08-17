/**
 * 백엔드 Swagger(OpenAPI) 문서를 읽어 `app/api/schema.d.ts` 를 생성한다.
 *
 *   npm run gen:api
 *
 * 문서 주소는 `.env` 의 API_DOCS_URL 에서 읽는다. 서버 주소는 깃에 올리지 않으므로
 * 이 스크립트에도 리터럴로 적지 않는다.
 */
import { mkdir, writeFile } from "node:fs/promises";

import openapiTS, { astToString } from "openapi-typescript";

const docsUrl = process.env.API_DOCS_URL;

if (!docsUrl) {
  console.error(
    [
      "환경변수 API_DOCS_URL 이 없다.",
      "",
      "  cp .env.example .env",
      "",
      "로 .env 를 만들고 백엔드 Swagger JSON 주소를 채운다.",
      "(Swagger UI 페이지가 아니라 /v3/api-docs 같은 JSON 경로)",
    ].join("\n"),
  );
  process.exit(1);
}

const outputPath = new URL("../app/api/schema.d.ts", import.meta.url);

const banner = `/**
 * 이 파일은 자동 생성된다. 직접 수정하지 않는다.
 * 백엔드 스키마가 바뀌면 \`npm run gen:api\` 로 다시 만든다.
 *
 * 화면 코드는 이 파일을 직접 import 하지 않는다. \`app/api/types.ts\` 를 거친다.
 */

`;

console.log(`OpenAPI 문서를 읽는다: ${docsUrl}`);

const ast = await openapiTS(new URL(docsUrl));

await mkdir(new URL(".", outputPath), { recursive: true });
await writeFile(outputPath, banner + astToString(ast), "utf8");

console.log("생성 완료: app/api/schema.d.ts");
