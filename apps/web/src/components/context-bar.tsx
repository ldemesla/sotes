"use client";

import Image from "next/image";
import React from "react";
import { useContextState } from "../context/ContextProvider";

export const ContextBar = () => {
  const { context } = useContextState();
  console.log("context", context);

  return (
    <div className='shadow-section hidden max-w-sm flex-1 flex-col justify-start rounded-lg bg-[url(/bg.png)] bg-cover p-8 xl:flex'>
      <Image
        src='/logo.svg'
        width={40}
        height={40}
        alt='logo'
        className='mx-auto'
      />
      <div className='mt-4'>
        {context.map((item, index) => (
          <div key={index} className='text-white mb-2'>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
