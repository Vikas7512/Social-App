import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Register } from "./pages/register/Register.jsx";
import { Login } from "./pages/login/Login.jsx";

import { Layout } from "./components/appshell/Layout.jsx";
import Home from "./pages/home/Home.jsx";
import { Profile } from "./pages/profile/Profile.jsx";
import { PrivateRoutes } from "./routes/PrivateRoutes.jsx";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthContextProvider } from "./context/AuthContex.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoutes>
        <Layout />
      </PrivateRoutes>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DarkModeContextProvider>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </DarkModeContextProvider>
  </StrictMode>
);
