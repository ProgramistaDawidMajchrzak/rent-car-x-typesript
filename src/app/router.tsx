import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/Home/HomePage";
// import { CarsPage } from "../pages/Cars/CarsPage";
// import { NotFoundPage } from "../pages/NotFound/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
//   {
//     path: "/cars",
//     element: <CarsPage />,
//   },
//   {
//     path: "*",
//     element: <NotFoundPage />,
//   },
]);

export const AppRouter = () => <RouterProvider router={router} />;
