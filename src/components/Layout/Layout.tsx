// src/components/Layout/Layout.tsx
import React, { ReactNode } from "react";
import TopBar from "./TopBar";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 p-4 bg-gray-50">{children}</main>
    </div>
  );
};

export default Layout;
