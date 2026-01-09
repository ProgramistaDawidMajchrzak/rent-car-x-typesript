import React from "react";
import { Image } from "../../../components/Image";

export const CarRentalHeroCompact: React.FC = () => {
  return (
    <div className="flex relative flex-row justify-start items-start mx-auto w-full bg-slate-900 h-[320px] max-md:flex-col max-md:h-auto">
      <HeroContentCompact />

      <Image
        name="heroImage"
        className="absolute top-0 right-0 z-0 h-[300px] w-[520px] object-contain max-md:relative max-md:w-full max-md:h-auto"
        alt="Hero Image Car"
      />
    </div>
  );
};

const HeroContentCompact: React.FC = () => {
  return (
    <div className="flex z-10 flex-col gap-6 items-start py-6 pr-6 pl-0 mt-8 ml-32 bg-black bg-opacity-10 h-[240px] w-[420px] max-md:ml-0 max-md:w-[90%] max-md:p-4">
      {/* Title */}
      <div className="text-3xl font-bold text-white max-sm:text-2xl">
        Enjoy your life with <br />
        our comfortable cars.
      </div>

      {/* Subtitle */}
      <div className="text-lg leading-7 text-white text-opacity-80 max-sm:text-base">
        RentCarX is ready to serve the best <br />
        experience in car rental.
      </div>

      {/* CTA */}
      <button
        onClick={() => window.location.href = "/car-list"}
        className="px-5 py-2.5 w-48 text-lg bg-white rounded cursor-pointer text-neutral-900 hover:bg-gray-100 transition max-sm:w-full"
      >
        Explore Cars
      </button>
    </div>
  );
};
