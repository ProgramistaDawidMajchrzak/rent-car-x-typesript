import React from "react";
import { Image } from "../Image";
import { Button } from "../Form/Button";
import { isLoggedIn, getRole, logout } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const logged = isLoggedIn();
  const role = getRole(); // USER / ADMIN

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center flex-wrap gap-3">
      {/* LOGO */}
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer"
        aria-label="Go to home"
      >
        <Image name="logoNav" className="w-36 h-auto rounded-xl" alt="Logo" />
      </div>

      {/* ACTIONS */}
      <nav className="flex items-center gap-3 flex-wrap justify-end">
        {/* Explore Cars – always visible */}
        <button
          onClick={() => navigate("/car-list")}
          className="px-4 py-2 border border-slate-900 text-slate-900 rounded text-sm font-semibold hover:bg-slate-100 transition"
        >
          Explore Cars
        </button>

        {!logged && (
          <>
            <Button value="Sign In" onClick={() => navigate("/signin")} />
            <Button value="Log In" onClick={() => navigate("/login")} />
          </>
        )}

        {logged && (
          <>
            {/* My Account / Admin */}
            <button
              onClick={() =>
                navigate(role === "ADMIN" ? "/admin" : "/my-account")
              }
              className="px-4 py-2 bg-blue-900 text-white rounded text-sm font-semibold hover:bg-blue-800 transition"
            >
              {role === "ADMIN" ? "Admin Panel" : "My Account"}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-500 transition"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default TopBar;
