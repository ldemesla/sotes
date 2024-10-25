import { Document, UpdateDocumentInput } from "~/server/domains/document/document.types";
import type { Editor } from "@tiptap/core";
import type { EditorEvents } from "@tiptap/core";
import ExtensionKit from "~/extensions/extension-kit";
import debounce from "debounce";
import { updateDocument } from "~/server/domains/document/document.actions";
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
  document,
  update,
}: {
  aiToken?: string;
  userId?: string;
  userName?: string;
  document: Document;
  update: (id: string, document: UpdateDocumentInput) => void;
}) => {
  const debouncedUpdate = (event: EditorEvents["update"]) => {
    update(document.id, {
      content: JSON.parse(JSON.stringify(event.editor.getJSON())),
      markdown: event.editor.storage.markdown.getMarkdown(),
    });
  };

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      autofocus: true,

      onUpdate: debounce(debouncedUpdate, 200),
      onCreate: ctx => {
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
    [],
  );

  // window.editor = editor;

  return { editor };
};
