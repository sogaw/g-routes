import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";

import { main } from "../src";

beforeAll(() => {
  rmSync(join(__dirname, "/_src"), { recursive: true, force: true });
});

beforeAll(() => {
  // need to mkdir...
  const pages = join(__dirname, "/_src/pages");
  if (!existsSync(pages)) {
    mkdirSync(pages, { recursive: true });
  }

  // need to mkdir...
  ["/users", "/users/[userId]/posts"]
    .map((dir) => "/_src/pages" + dir)
    .map((dir) => join(__dirname, dir))
    .forEach((dir) => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });

  // create page components
  [
    "/index.tsx",
    "/users/index.tsx",
    "/users/new.tsx",
    "/users/[userId]/index.tsx",
    "/users/[userId]/edit.tsx",
    "/users/[userId]/posts/index.tsx",
    "/users/[userId]/posts/[postId].tsx",
  ]
    .map((page) => "/_src/pages" + page)
    .map((page) => join(__dirname, page))
    .forEach((page) => {
      if (!existsSync(page)) {
        writeFileSync(page, 'import React from "react";\nexport default function Comp() { return <div>Comp</div>; }');
      }
    });
});

it("", async () => {
  await main([...process.argv, "-i", "./test/_src/pages", "-o", "./test/_src/generated"]);

  const output = readFileSync(join(__dirname, "./_src/generated/routes.tsx"), "utf-8");

  expect(output).toEqual(
    `import Index from "../pages/index";
import UsersUserIdEdit from "../pages/users/[userId]/edit";
import UsersUserIdIndex from "../pages/users/[userId]/index";
import UsersUserIdPostsPostId from "../pages/users/[userId]/posts/[postId]";
import UsersUserIdPostsIndex from "../pages/users/[userId]/posts/index";
import UsersIndex from "../pages/users/index";
import UsersNew from "../pages/users/new";
const routes = [
  { path: "/", element: <Index /> },
  { path: "/users/:userId/edit", element: <UsersUserIdEdit /> },
  { path: "/users/:userId", element: <UsersUserIdIndex /> },
  { path: "/users/:userId/posts/:postId", element: <UsersUserIdPostsPostId /> },
  { path: "/users/:userId/posts", element: <UsersUserIdPostsIndex /> },
  { path: "/users", element: <UsersIndex /> },
  { path: "/users/new", element: <UsersNew /> },
];
export default routes;
`
  );
});
