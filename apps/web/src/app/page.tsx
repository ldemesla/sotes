import { BlockEditor } from "~/components/BlockEditor";
import { documentController } from "~/server/domains/document";
import { Document } from "~/server/domains/document/document.types";

export default async function Home() {
  // It's a temporary function. Once we have the list of previous notes, we will just replace it by a fetch of the selected notes or the creation of a new one
  const getDocument = async (): Promise<Document> => {
    const response = await documentController.listDocuments({
      pageSize: 1,
    });

    const isDocumentFound = response.documents.length > 0;

    if (isDocumentFound) return response.documents[0];

    const document = await documentController.createDocument({
      title: "Untitled",
      content: [],
    });

    return document;
  };

  const document = await getDocument();
  return (
    <main className="flex w-full flex-1 gap-2 rounded-lg bg-background p-2 text-card-foreground shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)]">
      <BlockEditor document={document} />

      <div className="w-[320px] rounded bg-[#EA96B8]"></div>
    </main>
  );
}
