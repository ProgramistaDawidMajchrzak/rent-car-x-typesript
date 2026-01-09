import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPassword } from "../../services/auth.service.js";
import { Image } from "../../components/Image";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

type FormData = yup.InferType<typeof schema>;

export const ForgotPasswordPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const [info, setInfo] = useState<string>("");
  const [resetLink, setResetLink] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");

  const onSubmit = async (data: FormData) => {
    setInfo("");
    setResetLink("");
    setServerError("");

    try {
      const res = await forgotPassword(data.email);
      setInfo("If the account exists, you’ll receive a reset email in MailDev.");
      if (res?.resetLink) setResetLink(res.resetLink);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Forgot password failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex h-screen min-w-[screen]">
        {/* LEFT */}
        <div className="flex flex-col justify-center p-10 w-1/2 max-md:w-full">
          <div className="mx-auto w-full max-w-[320px]">
            <div className="mb-4 text-2xl font-bold">Forgot password</div>

            <div className="flex flex-col gap-4 mb-6">
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Email</label>
                <input
                  {...register("email")}
                  placeholder="Enter your email"
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">{errors.email?.message}</p>
              </div>

              {/* INFO / ERROR */}
              {serverError && <p className="text-red-600 text-xs font-medium">{serverError}</p>}
              {info && <p className="text-xs">{info}</p>}

              {/* DEV-only */}
              {resetLink && (
                <a className="text-xs underline" href={resetLink}>
                  Open reset link (DEV)
                </a>
              )}
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
                {isSubmitting ? "Loading..." : "Send link"}
              </button>
            </div>
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
