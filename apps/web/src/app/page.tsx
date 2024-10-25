import { Button } from "~/components/ui/button";
import { Document } from "~/server/domains/document/document.types";
import { DocumentCard } from "~/components/document-card";
import Image from "next/image";
import Link from "next/link";
import { MicrophoneIcon } from "~/components/icons/MicrophoneIcon";
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
    <div className="bg-card/60 relative flex h-full flex-1  flex-col items-center gap-16 overflow-hidden rounded-lg bg-[url('/noise.svg')] bg-[length:250px_250px] bg-repeat p-12 bg-blend-multiply shadow-md">
      <Image src="/logo.svg" alt="logo" width={100} height={100} />
      <div className="text-center">
        <h1 className="font-serif text-3xl font-medium text-black/90">Hello, Fredrika</h1>
        <p className="font-serif text-3xl font-medium text-black/30">What&apos;s on your mind?</p>
        <Link href={crypto.randomUUID()}>
          <Button variant="ghost" size="icon" className="mt-4 min-h-14 w-14 text-white [&_svg]:size-6">
            <MicrophoneIcon />
          </Button>
        </Link>
      </div>

      <NoteInitiator />

      <div className="w-full">
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
