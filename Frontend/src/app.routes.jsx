import { createBrowserRouter } from "react-router-dom";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Feed from "./features/post/pages/Feed";
import CreatePost from "./features/post/pages/CreatePost";
import MainLayout from "./features/post/layouts/MainLayout";
import Profile from "./features/post/pages/Profile"
import Message from "./features/post/pages/Message";


export const router = createBrowserRouter([
  
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },

  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Feed />
      },
      {
        path: "/create-post",
        element: <CreatePost />
      },
      {
       path: "/profile/:username",
       element: <Profile />
      },
      {
        path: "/messages",
        element: <Message />
      }
    ]
  }

]);