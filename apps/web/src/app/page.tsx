import { Document } from "~/server/domains/document/document.types";
import Link from "next/link";
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
    <div>
      <div className=''>
        <p className=''>Recent</p>
        <div className='grid grid-cols-3 gap-4'>
          {documents.map((document) => (
            <Link
              key={document.id}
              className='rounded bg-white p-4'
              href={`/${document.id}`}
            >
              {document.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
