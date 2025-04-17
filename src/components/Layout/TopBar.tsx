// src/components/Layout/TopBar.tsx
import React from "react";

const TopBar: React.FC = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">My App</h1>
      <nav className="space-x-4">
        <a href="/" className="text-blue-600 hover:underline">Home</a>
        <a href="/about" className="text-blue-600 hover:underline">About</a>
      </nav>
    </header>
  );
};

export default TopBar;
