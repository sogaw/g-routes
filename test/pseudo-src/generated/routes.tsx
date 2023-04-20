import React from "react";
import Users from "../pages/users/index";
import UsersNew from "../pages/users/new";
import UsersUserIdEdit from "../pages/users/[userId]/edit";
import UsersUserId from "../pages/users/[userId]/index";
import UsersUserIdPostsPostId from "../pages/users/[userId]/posts/[postId]";
import UsersUserIdPosts from "../pages/users/[userId]/posts/index";
const routes = [
  { path: "/users", element: <Users /> },
  { path: "/users/new", element: <UsersNew /> },
  { path: "/users/:userId/edit", element: <UsersUserIdEdit /> },
  { path: "/users/:userId", element: <UsersUserId /> },
  { path: "/users/:userId/posts/:postId", element: <UsersUserIdPostsPostId /> },
  { path: "/users/:userId/posts", element: <UsersUserIdPosts /> },
];
export default routes;