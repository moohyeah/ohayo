import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import GamePage from "./pages/GamePage.tsx";

import "./index.css";

const baseUrl = import.meta.env.VITE_BASE_URL || '/';
console.log(`baseUrl: ${baseUrl}`);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/game",
    element: <GamePage />,
  },
], {basename: baseUrl});


ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);
