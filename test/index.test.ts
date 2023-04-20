import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";

import { main } from "../src";

beforeAll(() => {
  rmSync(join(__dirname, "/pseudo-src"), { recursive: true, force: true });
});

beforeAll(() => {
  const pages = join(__dirname, "/pseudo-src/pages");
  if (!existsSync(pages)) {
    mkdirSync(pages, { recursive: true });
  }

  ["/users", "/users/[userId]/posts"]
    .map((dir) => "/pseudo-src/pages" + dir)
    .map((dir) => join(__dirname, dir))
    .forEach((dir) => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });

  [
    "/index.tsx",
    "/users/index.tsx",
    "/users/new.tsx",
    "/users/[userId]/index.tsx",
    "/users/[userId]/edit.tsx",
    "/users/[userId]/posts/index.tsx",
    "/users/[userId]/posts/[postId].tsx",
  ]
    .map((page) => "/pseudo-src/pages" + page)
    .map((page) => join(__dirname, page))
    .forEach((page) => {
      if (!existsSync(page)) {
        writeFileSync(page, "export default function Comp() { return <div>Comp</div>; }");
      }
    });
});

it("", async () => {
  await main([...process.argv, "-i", "./test/pseudo-src/pages", "-o", "./test/pseudo-src/generated"]);
});
