import React from 'react';
import {Image} from '../../../components/Image';

export const CarRentalHero: React.FC = () => {
  return (
    <div className="flex relative flex-row justify-start items-start mx-auto w-full max-w-none bg-slate-900 h-[650px] max-md:flex-col max-md:items-center max-md:max-w-[991px] max-sm:max-w-screen-sm">
        <HeroContent />
        <Image 
            name="heroImage" 
            className="absolute top-0 right-0 z-0 h-[545px] w-[909px] max-md:relative max-md:top-0 max-md:w-full max-md:h-auto" 
            alt="Hero Image Car" 
        />
    </div>
  );
};

const HeroContent: React.FC = () => {
    const contentData = [
      { text: "Enjoy your life with", lineBreak: true },
      { text: "our comfortable", lineBreak: true },
      { text: "cars.", lineBreak: false }
    ];

    return (
      <div className="flex z-10 flex-col gap-12 items-start py-8 pr-8 pl-0 mt-12 ml-40 bg-black bg-opacity-10 h-[445px] w-[528px] max-md:p-4 max-md:w-[90%] max-sm:p-2 max-sm:w-full">
        <div className="text-5xl font-[700] text-white max-sm:text-3xl">
          {contentData.map((item, index) => (
            <React.Fragment key={index}>
              <span>{item.text}</span>
              {item.lineBreak && <br />}
            </React.Fragment>
          ))}
        </div>
        <div className="text-2xl leading-10 text-white text-opacity-80 max-sm:text-lg max-sm:leading-7">
          <span>
            <span>RentCarX, is ready to serve the best</span>
            <br />
            <span>experience in car rental.</span>
          </span>
        </div>
        <button className="px-6 py-3 w-64 text-2xl bg-white rounded cursor-pointer text-neutral-900 max-sm:px-4 max-sm:py-2.5 max-sm:w-full max-sm:text-lg">
          Explore Now
        </button>
      </div>
    );
  };