import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { transcriptionController } from "~/server/api/domains";

export const transcriptionRouter = createTRPCRouter({
  translateAudio: publicProcedure
    .input(
      z.object({
        audioData: z.string(),
        mimeType: z.string(),
      }),
    )
    .mutation(async ({ input }) =>
      transcriptionController.translateAudio(input),
    ),
});
