"use client";

import "~/styles/index.css";

import React, { useRef } from "react";

import { EditorContent } from "@tiptap/react";
import { useBlockEditor } from "~/hooks/useBlockEditor";

export const BlockEditor = ({
  aiToken,
}: {
  aiToken?: string;
  hasCollab?: boolean;
}) => {
  const menuContainerRef = useRef(null);

  const { editor } = useBlockEditor({
    aiToken,
  });

  console.log(editor);

  if (!editor) {
    return null;
  }

  return (
    <div className='flex h-full' ref={menuContainerRef}>
      <div className='relative flex flex-col flex-1 h-full overflow-hidden'>
        <EditorContent editor={editor} className='flex-1 overflow-y-auto' />
      </div>
    </div>
  );
};

export default BlockEditor;
