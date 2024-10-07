import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import CallbackPage from "./pages/CallbackPage.tsx";
import ShopPage from "./pages/ShopPage.tsx";

import "./index.css";

const baseUrl = import.meta.env.VITE_BASE_URL || '/';
console.log(`baseUrl: ${baseUrl}`);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/callback",
    element: <CallbackPage />,
  },
  {
    path: "home",
    element: <HomePage />,
  },
  {
    path: "/shop",
    element: <ShopPage />,
  },
], {basename: baseUrl});


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
