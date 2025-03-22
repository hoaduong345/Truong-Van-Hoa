import MessyReact from "@/pages/MessyReact";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import AlgorithmPage from "@/pages/Algorithm";
import Crud from "@/pages/Crud";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        index: true,
        path: "algorithm",
        element: <AlgorithmPage />,
      },
      {
        path: "messy-react",
        element: <MessyReact />,
      },
      {
        path: "architecture",
        element: <Crud />,
      },
    ],
  },
]);
