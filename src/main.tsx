import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import CallbackPage from "./pages/CallbackPage.tsx";
import ShopPage from "./pages/ShopPage.tsx";
import GamePage from "./pages/GamePage.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import UnregisterCallbackPage from "./pages/UnregisterCallbackPage.tsx";
import UnRegisterPage from "./pages/UnregisterPage.tsx";
import TeamAndConditions from "./pages/TeamAndConditions.tsx";


import "./index.css";

const baseUrl = import.meta.env.VITE_BASE_URL || '/';
console.log(`baseUrl: ${baseUrl}`);

const router = createBrowserRouter([
  {
    path: "/game",
    element: <GamePage />,
  },
  {
    path: "/callback",
    element: <CallbackPage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/shop",
    element: <ShopPage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/google_unregister",
    element: <UnRegisterPage />,
  },
  {
    path: "/unregister_callback",
    element: <UnregisterCallbackPage />,
  },
  {
    path: "/terms-and-conditions",
    element: <TeamAndConditions />,
  },
], {basename: baseUrl});


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
