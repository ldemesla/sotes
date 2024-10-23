import { BlockEditor } from "~/components/BlockEditor";
import { VoiceRecorder } from "~/components/record-voice";

export default async function Home() {
  return (
    <main className='flex w-full flex-1 gap-2 rounded-lg bg-background p-2 text-card-foreground shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)]'>
      <div className='container flex flex-col items-center gap-12 rounded bg-card px-4 py-16'>
        <BlockEditor />
        <VoiceRecorder />
      </div>
      <div className='w-[320px] rounded bg-[#EA96B8]'></div>
    </main>
  );
}
