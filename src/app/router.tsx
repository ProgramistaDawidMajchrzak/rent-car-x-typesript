import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/Home/HomePage";
import { CarListPage } from "../pages/CarListPage/CarListPage";
import { SignInPage } from "../pages/AuthPage/SignIn";
import { LogInPage } from "../pages/AuthPage/LogInPage";
import { Board } from "../pages/AdminBoard/Board";
import { AdminUsers } from "../pages/AdminBoard/AdminUsers";
import { AdminCars } from "../pages/AdminBoard/AdminCars";
import { EmailConfirmationPage } from "../pages/AuthPage/ConfirmationPage";
import { ReservationPage } from "../pages/Reservation/ReservationPage";
import { MyAccountPage } from "../pages/MyAccount/MyAccountPage";
import { ForgotPasswordPage } from "../pages/AuthPage/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/AuthPage/ResetPasswordPage";


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
    path: "/confirm-email",
    element: <EmailConfirmationPage />,
  },
  {
    path: "/login",
    element: <LogInPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/my-account",
    element: <MyAccountPage />,
  },
  {
    path: "/admin",
    element: <Board />,
  },
  {
    path: "/admin/users",
    element: <AdminUsers />,
  },
  {
    path: "/admin/cars",
    element: <AdminCars />,
  },

  // ⭐ NOWA ŚCIEŻKA
  {
    path: "/reservation/:carId",
    element: <ReservationPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
