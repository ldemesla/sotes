import { openai } from "../../providers/openai";
import { TranslateAudioInput } from "./transcription.type";
import { toFile } from "openai/uploads.mjs";

export class TranscriptionController {
  async translateAudio(input: TranslateAudioInput): Promise<string> {
    const audioBuffer = Buffer.from(
      input.audioData.replace(/^data:audio\/\w+;base64,/, ""),
      "base64",
    );

    const audioFile = await toFile(audioBuffer, "audio.wav", {
      type: input.mimeType,
    });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
      response_format: "text",
    });

    return transcription;
  }
}
