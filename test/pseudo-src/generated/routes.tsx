import React from "react";
import Index from "../pages/index";
import UsersIndex from "../pages/users/index";
import UsersNew from "../pages/users/new";
import UsersUserIdEdit from "../pages/users/[userId]/edit";
import UsersUserIdIndex from "../pages/users/[userId]/index";
import UsersUserIdPostsPostId from "../pages/users/[userId]/posts/[postId]";
import UsersUserIdPostsIndex from "../pages/users/[userId]/posts/index";
const routes = [
  { path: "/", element: <Index /> },
  { path: "/users", element: <UsersIndex /> },
  { path: "/users/new", element: <UsersNew /> },
  { path: "/users/:userId/edit", element: <UsersUserIdEdit /> },
  { path: "/users/:userId", element: <UsersUserIdIndex /> },
  { path: "/users/:userId/posts/:postId", element: <UsersUserIdPostsPostId /> },
  { path: "/users/:userId/posts", element: <UsersUserIdPostsIndex /> },
];
export default routes;
