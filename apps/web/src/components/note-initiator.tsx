"use client";

import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { useState } from "react";

export const NoteInitiator = () => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      redirect(`/gen?query=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    <div className="group relative mx-auto w-full max-w-lg">
      <textarea
        placeholder="Search your notes..."
        className="shadow-item size-full resize-none rounded-2xl border border-none bg-[#F7F7F7] p-3 outline-none"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        rows={4}
        onKeyDown={handleKeyPress}
      />
      <Button
        className="absolute bottom-2 right-2 opacity-0 transition-opacity group-focus-within:opacity-100"
        size="icon"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.86209 2.86177C9.12244 2.60142 9.54455 2.60142 9.8049 2.86176L14.4716 7.52838C14.5966 7.65341 14.6668 7.82298 14.6668 7.99979C14.6668 8.1766 14.5966 8.34617 14.4716 8.4712L9.8049 13.1379C9.54455 13.3982 9.12244 13.3982 8.86209 13.1379C8.60174 12.8775 8.60174 12.4554 8.86209 12.1951L12.3907 8.66646H2.00016C1.63197 8.66646 1.3335 8.36798 1.3335 7.99979C1.3335 7.6316 1.63197 7.33312 2.00016 7.33312H12.3907L8.86209 3.80458C8.60174 3.54423 8.60174 3.12212 8.86209 2.86177Z"
            fill="currentColor"
          />
        </svg>
      </Button>
    </div>
  );
};
