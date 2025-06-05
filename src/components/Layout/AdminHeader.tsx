import * as React from "react";

function AdminHeader() {
  return (
    <header className="absolute h-[50px] left-[83px] top-[7px] w-[346px] max-md:left-[75px] max-md:w-[calc(100%_-_90px)] max-sm:left-[65px] max-sm:w-[calc(100%_-_80px)]">
      <h1 className="absolute top-0 left-0 text-2xl font-bold text-black h-[26px] w-[346px] max-md:text-2xl max-sm:w-full max-sm:text-xl">
        Add New Car
      </h1>
      <p className="absolute left-0 h-5 text-xs font-bold text-zinc-400 top-[30px] w-[271px] max-md:text-xs max-sm:w-full max-sm:text-xs">
        <span className="text-xs font-bold text-zinc-400 max-sm:text-xs">
          <span>Loggen In as</span>
          Dawid
        </span>
      </p>
    </header>
  );
}

export default AdminHeader;
