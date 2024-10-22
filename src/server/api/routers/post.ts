import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  translateAudio: publicProcedure
    .input(z.object({ audioData: z.string() }))
    .mutation(async ({ input }) => {
      const translateAudio = async (audioData: string): Promise<string> => {
        const response = await fetch(
          "https://api.openai.com/v1/audio/transcriptions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "multipart/form-data",
            },
            body: JSON.stringify({
              file: audioData,
              model: "whisper-1",
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to translate audio");
        }

        const result = await response.json();
        return result.text;
      };

      try {
        const translatedText = await translateAudio(input.audioData);
        return { success: true, text: translatedText };
      } catch (error) {
        console.error("Error translating audio:", error);
        return { success: false, error: "Failed to translate audio" };
      }
    }),
});
