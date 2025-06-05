import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/Home/HomePage";
import { CarListPage } from "../pages/CarListPage/CarListPage";
import { SignInPage } from "../pages/AuthPage/SignIn";
import { LogInPage } from "../pages/AuthPage/LogInPage";
import { Board } from "../pages/AdminBoard/Board";
// import { CarsPage } from "../pages/Cars/CarsPage";
// import { NotFoundPage } from "../pages/NotFound/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/car-list",
    element: <CarListPage />,
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    path: "/login",
    element: <LogInPage />,
  },
  {
    path: "/admin",
    element: <Board />,
  },
//   {
//     path: "*",
//     element: <NotFoundPage />,
//   },
]);

export const AppRouter = () => <RouterProvider router={router} />;
