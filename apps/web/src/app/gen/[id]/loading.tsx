import { ContextBar } from "~/components/context-bar";
import { Skeleton } from "~/components/ui/skeleton";
import { ContextProvider } from "~/context/ContextProvider";

export default function Loading() {
  return (
    <ContextProvider>
      <div className="bg-card relative flex size-full flex-1 flex-col gap-12 overflow-hidden rounded-lg p-8 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)]">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 overflow-y-auto">
          <Skeleton className="h-10 w-full bg-black/10" />
          <div>
            <Skeleton className="h-6 w-20 bg-black/10" />
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-2 p-2">
              <Skeleton className="h-20 w-full bg-black/10" />
              <Skeleton className="h-20 w-full bg-black/10" />
            </div>
          </div>
          <Skeleton className="h-80 w-full bg-black/10" />
          <Skeleton className="h-80 w-full bg-black/10" />
        </div>
      </div>
      <ContextBar />
    </ContextProvider>
  );
}
