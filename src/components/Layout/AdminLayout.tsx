import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

type LayoutProps = {
  children: ReactNode;
};

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="overflow-hidden relative w-full h-screen bg-white max-md:h-screen">
      <Sidebar />
      <div>
        <AdminHeader />
        {children}
      </div>
    </main>
  );
}

export default AdminLayout;