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
    <div className='bg-card relative flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-lg p-12 shadow-md'>
      <div className='mb-4'>
        <h1 className='font-serif text-2xl font-medium'>Hello, Fredrika</h1>
        <p className='text-muted-foreground font-serif text-2xl font-medium'>
          What’s on your mind?
        </p>
      </div>

      <div className='mb-4'>
        <textarea
          placeholder='How can I help you today?'
          className='border-input shadow-item w-full rounded-lg border bg-[#F7F7F7] p-3 text-sm outline-none'
        />
      </div>

      <div>
        <p className='text-md mb-2 font-semibold'>Recent</p>
        <div className='grid grid-cols-2 gap-4 xl:grid-cols-3'>
          {documents.map((document) => (
            <DocumentCard document={document} key={document.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
