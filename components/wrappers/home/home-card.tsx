"use client";
import React from "react";
import Image from "next/image";

export const HomeCard = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded-lg">
      {/* <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 text-center">
        Personalized 1-on-1 Tutoring
      </h1>
      <p className="text-white text-sm md:text-base mb-4 text-center max-w-2xl">
        Experience tailored learning, direct interaction, and maximum
        effectiveness with the best tutors, wherever you are.
      </p> */}
      <Image
        src="/images/image.png"
        alt="Tutor 1:1"
        width={1280}
        height={1280}
        layout="responsive"
        className="object-cover rounded-lg shadow-xl w-full h-[350px]"
      />
    </div>
  );
};
