"use client";

import Image from "next/image";
import React from "react";
import { useContextState } from "../context/ContextProvider";

export const ContextBar = ({ contextToAdd }: { contextToAdd?: string[] }) => {
  const { context } = useContextState();

  return (
    <div className="shadow-section hidden max-w-sm flex-1 flex-col justify-start rounded-lg bg-[url(/bg.png)] bg-cover pt-8 xl:flex">
      <Image src="/logo.svg" width={40} height={40} alt="logo" className="mx-auto" />
      <div className="flex h-full flex-col gap-2 overflow-y-auto p-8">
        {[...context, ...(contextToAdd ?? [])].map((item, index) => (
          <div key={index} className="rounded-lg  bg-[#CC155E]/20 p-4 text-[#CC155E]">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
