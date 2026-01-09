import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPassword } from "../../services/auth.service.js";
import { Image } from "../../components/Image";

const schema = yup.object({
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

type FormData = yup.InferType<typeof schema>;

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export const ResetPasswordPage: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const userId = query.get("userId") ?? "";
  const token = query.get("token") ?? "";

  const [serverError, setServerError] = useState("");
  const [ok, setOk] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    setOk("");

    try {
      await resetPassword({ userId, token, newPassword: data.newPassword });
      setOk("Password changed. You can log in now.");
      setTimeout(() => navigate("/login"), 700);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Reset failed.");
    }
  };

  const invalidLink = !userId || !token;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex h-screen min-w-[screen]">
        {/* LEFT */}
        <div className="flex flex-col justify-center p-10 w-1/2 max-md:w-full">
          <div className="mx-auto w-full max-w-[320px]">
            <div className="mb-4 text-2xl font-bold">Reset password</div>

            {invalidLink ? (
              <p className="text-red-600 text-xs font-medium">Invalid reset link.</p>
            ) : (
              <>
                <div className="flex flex-col gap-4 mb-6">
                  {/* New password */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold">New password</label>
                    <input
                      type="password"
                      {...register("newPassword")}
                      placeholder="Enter new password"
                      className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                    />
                    <p className="text-red-500 text-xs">{errors.newPassword?.message}</p>
                  </div>

                  {/* Confirm password */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold">Confirm password</label>
                    <input
                      type="password"
                      {...register("confirmPassword")}
                      placeholder="Confirm new password"
                      className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                    />
                    <p className="text-red-500 text-xs">{errors.confirmPassword?.message}</p>
                  </div>

                  {/* Messages */}
                  {serverError && <p className="text-red-600 text-xs font-medium">{serverError}</p>}
                  {ok && <p className="text-green-700 text-xs font-medium">{ok}</p>}
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <a href="/login">
                    <div className="flex items-center justify-center px-4 text-xs font-bold rounded border cursor-pointer border-slate-900 h-[30px] w-[160px] text-slate-900">
                      Log In
                    </div>
                  </a>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex justify-center items-center px-4 rounded cursor-pointer bg-slate-900 w-[160px] h-[30px] text-xs font-bold text-white disabled:opacity-50"
                  >
                    {isSubmitting ? "Loading..." : "Reset"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center items-center bg-[linear-gradient(155deg,#02193D_-0.86%,#02193D_98.91%)] w-1/2 max-md:hidden">
          <div className="flex flex-col items-center">
            <Image name="LogoAuth" className="w-[320px]" alt="Logo" />
          </div>
        </div>
      </div>
    </form>
  );
};
