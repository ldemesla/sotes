import { Document } from "~/server/domains/document/document.types";
import { DocumentCard } from "~/components/document-card";
import { documentController } from "~/server/domains/document";

const getDocuments = async (): Promise<Document[]> => {
  const response = await documentController.listDocuments({
    pageSize: 10,
  });

  return response?.documents ?? [];
};

export default async function Home() {
  const documents = await getDocuments();

  return (
    <div className='bg-card relative flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-lg p-6 shadow-md'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold font-serif'>Hello, Fredrika</h1>
        <p className='text-muted-foreground text-2xl font-serif'>What’s on your mind?</p>
      </div>

      <div className='mb-4'>
        <input
          type='text'
          placeholder='How can I help you today?'
          className='border-input w-full rounded-lg border p-3 text-sm shadow-sm'
        />
      </div>

      <div>
        <p className='text-lg font-semibold'>Recent</p>
        <div className='grid grid-cols-3 gap-4'>
          {documents.map((document) => (
            <DocumentCard document={document} key={document.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
