"use client";

import { createGeneratedNote } from "~/server/domains/document/document.actions";
import { redirect } from "next/navigation";
import { useState } from "react";

export const NoteInitiator = () => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      redirect(`/gen/new?query=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    <textarea
      placeholder="How can I help you today?"
      className="border-input shadow-item w-full rounded-lg border bg-[#F7F7F7] p-3 text-sm outline-none"
      value={inputValue}
      onChange={e => setInputValue(e.target.value)}
      onKeyDown={handleKeyPress}
    />
  );
};
