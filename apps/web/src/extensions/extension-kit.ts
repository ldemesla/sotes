"use client";

import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Heading from "@tiptap/extension-heading";

export const ExtensionKit = () => [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  Markdown,
];

export default ExtensionKit;
