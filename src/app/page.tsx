import { HydrateClient, api } from "~/trpc/server";

import { VoiceRecorder } from "./_components/record-voice";

export default async function Home() {
  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex w-full flex-1 gap-2 rounded-lg bg-background p-2 text-card shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)]">
        <div className="container flex flex-col items-center justify-center gap-12 rounded bg-card px-4 py-16">
          <VoiceRecorder />
        </div>
        <div className="w-[320px] rounded bg-[#EA96B8]"></div>
      </main>
    </HydrateClient>
  );
}
