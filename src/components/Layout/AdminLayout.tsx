import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

type LayoutProps = {
  title: string;
  children: ReactNode;
};

const AdminLayout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <main className="relative w-full h-screen bg-white flex overflow-x-hidden">
      <Sidebar />
      <div>
        <AdminHeader title={title} />
        <div className="pt-20 pl-24"> {/* padding żeby treść nie wchodziła na header */}
          {children}
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;
