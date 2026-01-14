import { createHashRouter, RouterProvider } from "react-router-dom";
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
import { AdminReservations } from "../pages/AdminBoard/AdminReservations";
import { AdminExportsPage } from "../pages/AdminBoard/ExportsPage";
import { AdminStripePage } from "../pages/AdminBoard/AdminStripePage";
import { PaymentSuccessPage } from "../pages/Payments/PaymentSuccessPage";

const router = createHashRouter([
  { path: "/", element: <HomePage /> },
  { path: "/car-list", element: <CarListPage /> },
  { path: "/signin", element: <SignInPage /> },
  { path: "/confirm-email", element: <EmailConfirmationPage /> },
  { path: "/login", element: <LogInPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/my-account", element: <MyAccountPage /> },
  { path: "/admin", element: <Board /> },
  { path: "/admin/users", element: <AdminUsers /> },
  { path: "/admin/cars", element: <AdminCars /> },
  { path: "/admin/reservations", element: <AdminReservations /> },
  { path: "/admin/exports", element: <AdminExportsPage /> },
  { path: "/admin/stripe", element: <AdminStripePage /> },
  { path: "/success", element: <PaymentSuccessPage /> },
  { path: "/reservation/:carId", element: <ReservationPage /> },
]);

export const AppRouter = () => <RouterProvider router={router} />;
