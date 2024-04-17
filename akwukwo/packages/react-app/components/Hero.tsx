import React from "react";
import Image from "next/image";
import illustrations from "../assests/images/illustrations.jpg";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-white-800 text-black py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-center font-extralight pb-2 md:text-8xl">
          Akwụkwọ
        </h1>
        <p className="text-center text-4xl md:text-5xl font-latoBold pb-6">
          Bringing the Power of Blockchain for Authors, Creators, and Readers
        </p>
        <p className="text-center font-sfProRegular text-gray text-lg xl:px-72 lg:px-6 px-6 mb-16">
          Akwụkwọ bring the revolutionary advance to claim back the value of
          digital publishing and library. We want authors to benefit from the
          see change of NFT technology, and also readers to be able to cherish
          new and exciting content for the first time.. We are Just at beginning
          of NFTS Books capabilities
        </p>

        <div className=" relative m-auto sm:h-[30rem] rounded-[1.25rem] max-w-4xl h-full border-[0.375rem] border-magenta">
          <Image
            src={illustrations}
            alt="book illsutrations"
            className="m-auto object-cover h-auto w-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
