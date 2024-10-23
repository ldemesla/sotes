import type { Editor } from "@tiptap/core";
import ExtensionKit from "~/extensions/extension-kit";
import { useEditor } from "@tiptap/react";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = ({
  aiToken,
  userId,
  userName = "Maxi",
}: {
  aiToken?: string;
  userId?: string;
  userName?: string;
}) => {
  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: (ctx) => {
        // if (provider && !provider.isSynced) {
        //   provider.on("synced", () => {
        //     setTimeout(() => {
        //       if (ctx.editor.isEmpty) {
        //         ctx.editor.commands.setContent(initialContent);
        //       }
        //     }, 0);
        //   });
        // } else if (ctx.editor.isEmpty) {
        //   ctx.editor.commands.setContent(initialContent);
        //   ctx.editor.commands.focus("start", { scrollIntoView: true });
        // }
      },
      extensions: ExtensionKit(),

      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full",
        },
      },
    },
    []
  );

  window.editor = editor;

  return { editor };
};
