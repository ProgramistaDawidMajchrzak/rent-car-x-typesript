import React from "react";
import { Image } from "../Image";
import { Button } from "../Form/Button";

const TopBar: React.FC = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Image name="logoNav" className="w-36 h-auto rounded-xl" alt="Logo" />
      <nav className="space-x-4">
        <a href="/signin">
          <Button value="Sign In"/>
        </a>
        <a href="/login">
          <Button value="Log In"/>
        </a>
      </nav>
    </header>
  );
};

export default TopBar;
