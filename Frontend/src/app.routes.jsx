import { createBrowserRouter } from "react-router-dom";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Feed from "./features/post/pages/Feed";
import CreatePost from "./features/post/pages/CreatePost";
import MainLayout from "./features/post/layouts/MainLayout";
import Profile from "./features/post/pages/Profile";
import Message from "./features/post/pages/Message";
import Reels from "./features/post/pages/Reels";

import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import PublicRoute from "./features/auth/components/PublicRoute";



export const router = createBrowserRouter([

  // ✅ PUBLIC ROUTES (login/register)
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  // ✅ PROTECTED ROUTES
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <Feed />,
          },
          {
            path: "/create-post",
            element: <CreatePost />,
          },
          {
            path: "/profile/:username",
            element: <Profile />,
          },
          {
            path: "/messages",
            element: <Message />,
          },
          {
            path: "/reels",
            element: <Reels />,
          },
        ],
      },
    ],
  },
]);


