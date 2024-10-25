import { Document } from "~/server/domains/document/document.types";
import { DocumentCard } from "~/components/document-card";
import { NoteInitiator } from "~/components/note-initiator";
import { documentController } from "~/server/domains/document";

const getDocuments = async (): Promise<Document[]> => {
  const response = await documentController.listDocuments({
    pageSize: 9,
  });

  return response?.documents ?? [];
};

export default async function Home() {
  const documents = await getDocuments();

  return (
    <div className="bg-card relative flex h-full flex-1 flex-col gap-16 overflow-hidden rounded-lg p-12 shadow-md">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-medium text-black/90">Hello, Fredrika</h1>
        <p className="font-serif text-3xl font-medium text-black/30">What&apos;s on your mind?</p>
      </div>

      <NoteInitiator />
      <div className="">
        <p className="text-md mb-2 font-semibold">Recent</p>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          {documents.map(document => (
            <DocumentCard document={document} key={document.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
