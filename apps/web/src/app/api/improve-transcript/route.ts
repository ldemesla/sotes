import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ContentSchema = z.object({
  type: z.literal("doc"),
  content: z.array(
    z.object({
      type: z.union([z.literal("heading"), z.literal("paragraph")]),
      attrs: z
        .object({
          level: z.union([z.literal(2), z.literal(3)]),
        })
        .optional(),
      content: z
        .array(
          z.object({
            type: z.literal("text"),
            text: z.string(),
          }),
        )
        .optional(),
    }),
  ),
});

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert editor and writer, skilled at improving transcripts and structuring content in JSON format.", // TODO: style of writing of Paul Graham
        },
        {
          role: "user",
          content: `Rewrite the transcript into written text according to these guidelines:
1. Remove filler words (um, uh, like, you know, etc.)
2. Improve the overall writing quality
3. Use simple and concise language
4. Add appropriate headlines to structure the content
5. Add minor context where necessary, such as full names or brief explanations
6. Maintain the original meaning and key points of the content

Here's the transcript to improve:

${content}
`,
        },
      ],
      response_format: zodResponseFormat(ContentSchema, "content"),
    });

    const improvedContent = completion.choices[0].message.parsed;

    return NextResponse.json(improvedContent);
  } catch (error) {
    console.error("Error improving transcript:", error);
    return NextResponse.json({ error: "Failed to improve transcript" }, { status: 500 });
  }
}
