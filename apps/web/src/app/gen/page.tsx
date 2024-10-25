import { ContextBar } from "~/components/context-bar";
import { ContextProvider } from "~/context/ContextProvider";
import { Document } from "~/server/domains/document/document.types";
import { documentController } from "~/server/domains/document";
import GeneratedNote from "~/components/GeneratedNote/GeneratedNote";

const getDocument = async (id: string): Promise<Document> => {
  try {
    const document = await documentController.getDocument(id);
    if (document) return document;
  } catch (error) {
    console.error("Error fetching document:", error);
  }

  const newDocument = await documentController.createDocument({
    title: "Untitled",
    content: {
      type: "doc",
      content: [],
    },
    markdown: "",
  });
  return newDocument;
};

export default async function GenPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const document = await getDocument(id);

  return (
    <ContextProvider>
      <GeneratedNote document={document} />
      <ContextBar />
    </ContextProvider>
  );
}
