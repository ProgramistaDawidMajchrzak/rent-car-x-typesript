import * as React from "react";
import { getUsernameFromToken } from "../../utils/jwt.utils";

interface AdminHeaderProps {
  title: string;
}

function AdminHeader({ title }: AdminHeaderProps) {
  const username = getUsernameFromToken() || "User";

  return (
    <header className="absolute h-[50px] left-[83px] top-[7px] w-[346px]">
      <h1 className="text-2xl font-bold text-black">{title}</h1>

      <p className="text-xs font-bold text-zinc-400 mt-1">
        Logged in as <span className="text-black">{username}</span>
      </p>
    </header>
  );
}

export default AdminHeader;
