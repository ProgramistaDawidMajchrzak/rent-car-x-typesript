import * as React from "react";
import { Icon } from "../Icon";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="absolute top-0 left-0 h-screen bg-slate-900 w-[66px] z-[1] flex flex-col justify-between items-center py-4 max-md:w-[60px] max-sm:w-[50px]">
      {/* Logo */}
      <div className="flex flex-col items-center">
        <Icon onClick={() => navigate("/admin")} name="logo" className="w-9 h-9 text-white cursor-pointer" />
      </div>

      {/* Main icons, 20cm = ~200px */}
      <div className="flex flex-col items-center space-y-6 mt-[200px]">
        <Icon onClick={() => navigate("/admin/users")} name="users" className="w-6 h-6 text-white cursor-pointer" />
        <Icon onClick={() => navigate("/admin/cars")} name="cars" className="w-6 h-6 text-white cursor-pointer" />
      </div>

      {/* Logout at bottom */}
      <div className="flex flex-col items-center mb-4">
        <button onClick={handleLogout}>
          <Icon name="logout" className="w-6 h-6 text-white hover:text-red-400 transition-colors cursor-pointer" />
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
