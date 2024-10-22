import { describe, it, expect } from "vitest";
import { transcriptionController } from "../..";
import { openai } from "~/server/api/providers/openai";

// Only for local development debugging
describe.skip("TranscriptionController", () => {
  describe("translateAudio", () => {
    describe("Given a valid audio data", () => {
      it("should return the transcription", async () => {
        // Arrange
        const text = "Hello, I'm Louis";
        const audioData = await openai.audio.speech.create({
          model: "tts-1",
          input: text,
          voice: "shimmer",
        });

        if (!audioData.body) throw new Error("No audio data");

        // Convert the Response to ArrayBuffer
        const arrayBuffer = await audioData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Convert the Buffer to base64
        const base64Audio = buffer.toString("base64");

        // Act
        const transcription = await transcriptionController.translateAudio({
          audioData: `data:audio/mp3;base64,${base64Audio}`,
          mimeType: "audio/mp3",
        });

        // Assert
        expect(transcription.toLowerCase()).toContain(text.toLowerCase());
      });
    });
  });
});
