import { BlockEditor } from "~/components/BlockEditor";
import { ContextBar } from "~/components/context-bar";
import { ContextProvider } from "~/context/ContextProvider";
import { documentController } from "~/server/domains/document";

export default async function Home({ params }: { params: { id: string } }) {
  const { id } = await params;

  const document = await documentController.getDocument(id);

  if (!document) return;

  return (
    <ContextProvider>
      <BlockEditor document={document} />
      <ContextBar />
    </ContextProvider>
  );
}
