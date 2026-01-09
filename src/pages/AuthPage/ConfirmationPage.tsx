import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { confirmEmail } from "../../services/auth.service.js";
import { Image } from "../../components/Image";

export const EmailConfirmationPage: React.FC = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const userId = params.get("userId");
  const token = params.get("token");

  useEffect(() => {
    const confirm = async () => {
      if (!userId || !token) {
        setStatus("error");
        return;
      }

      try {
        await confirmEmail(
        `/auth/confirm-email?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`
        );


        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    confirm();
  }, [userId, token]);

  return (
    <div className="flex h-screen min-w-[screen]">
      <div className="flex flex-col justify-center p-10 w-1/2 max-md:w-full">
        <div className="mx-auto w-full max-w-[320px]">

          {status === "loading" && (
            <div className="text-xl font-bold">Confirming your email...</div>
          )}

          {status === "success" && (
            <>
              <div className="mb-4 text-2xl font-bold">Email Confirmed ✔️</div>
              <p className="text-sm text-gray-700 mb-4">
                Your email has been successfully verified. You may now log in.
              </p>

              <a href="/login">
                <div className="flex items-center justify-center px-4 text-xs font-bold rounded border cursor-pointer border-slate-900 h-[30px] w-[160px] text-slate-900">
                  Log In
                </div>
              </a>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mb-4 text-2xl font-bold text-red-600">Verification Failed ❌</div>
              <p className="text-sm text-gray-700 mb-4">
                The confirmation link is invalid or expired.
              </p>

              <a href="/">
                <div className="flex items-center justify-center px-4 text-xs font-bold rounded border cursor-pointer border-red-600 h-[30px] w-[160px] text-red-600">
                  Back to Home
                </div>
              </a>
            </>
          )}

        </div>
      </div>

      <div className="flex justify-center items-center bg-[linear-gradient(155deg,#02193D_-0.86%,#02193D_98.91%)] w-1/2 max-md:hidden">
        <div className="flex flex-col items-center">
          <Image name="LogoAuth" className="w-[320px]" alt="Logo" />
        </div>
      </div>
    </div>
  );
};
