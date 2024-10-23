/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { WavRecorder, WavStreamPlayer } from "../../lib/wavtools";

import { Button } from "./ui/button";
import type { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { cn } from "../../lib/utils";
import logo from "./logo.svg";

/**
 * Running a local relay server will allow you to hide your API key
 * and run custom logic on the server
 *
 * Set the local relay server address to:
 * REACT_APP_LOCAL_RELAY_SERVER_URL=http://localhost:8081
 *
 * This will also require you to set OPENAI_API_KEY= in a `.env` file
 * You can run it with `npm run relay`, in parallel with `npm start`
 */
const LOCAL_RELAY_SERVER_URL: string = "ws://localhost:8081";

export const VoiceRecorder = () => {
  /**
   * Ask user for API Key
   * If we're using the local relay server, we don't need this
   */
  const apiKey = LOCAL_RELAY_SERVER_URL
    ? ""
    : (localStorage.getItem("tmp::voice_api_key") ??
      prompt("OpenAI API Key") ??
      "");
  if (apiKey !== "") {
    localStorage.setItem("tmp::voice_api_key", apiKey);
  }

  /**
   * Instantiate:
   * - WavRecorder (speech input)
   * - WavStreamPlayer (speech output)
   * - RealtimeClient (API client)
   */
  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  );
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient(
      LOCAL_RELAY_SERVER_URL
        ? { url: LOCAL_RELAY_SERVER_URL }
        : {
            apiKey: apiKey,
            dangerouslyAllowAPIKeyInBrowser: true,
          }
    )
  );

  /**
   * All of our variables for displaying application state
   * - items are all conversation items (dialog)
   */
  const [items, setItems] = useState<ItemType[]>([]);

  const [isConnected, setIsConnected] = useState(false);

  /**
   * Connect to conversation:
   * WavRecorder taks speech input, WavStreamPlayer output, client is API client
   */
  const connectConversation = useCallback(async () => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    // Set state variables
    setIsConnected(true);

    setItems(client.conversation.getItems());

    // Connect to microphone
    await wavRecorder.begin();

    // Connect to audio output
    await wavStreamPlayer.connect();

    // Connect to realtime API
    await client.connect();

    if (client.getTurnDetectionType() === "server_vad") {
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
    }
  }, []);

  /**
   * Disconnect and reset conversation state
   */
  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;
    wavStreamPlayer.interrupt();
  }, []);

  /**
   * Core RealtimeClient and audio capture setup
   * Set all of our instructions, tools, events and more
   */
  useEffect(() => {
    // Get refs
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;

    // Set instructions
    client.updateSession({
      turn_detection: { type: "server_vad" },
      //   instructions: instructions,
    });

    // Set transcription, otherwise we don't get user transcriptions back
    client.updateSession({ input_audio_transcription: { model: "whisper-1" } });

    client.on("error", (event: any) => console.error(event));
    client.on("conversation.interrupted", async () => {
      const trackSampleOffset = wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        client.cancelResponse(trackId, offset);
      }
    });
    client.on("conversation.item.appended", async ({ item, delta }: any) => {
      console.log("[conversation.item.appended]", item, delta);
    });
    client.on("conversation.updated", async ({ item, delta }: any) => {
      const items = client.conversation.getItems();
      console.log("[conversation.updated]", item, delta);

      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === "completed" && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
      setItems(items);
    });

    setItems(client.conversation.getItems());

    return () => {
      // cleanup; resets to defaults
      client.reset();
    };
  }, []);

  return (
    <div className="mb-4 flex flex-col items-center justify-between gap-4">
      {items.map(
        (item) =>
          item.formatted.transcript && (
            <div
              key={item.id}
              className={cn(
                "flex gap-2 rounded bg-slate-100 p-4",
                item.role === "user"
                  ? "self-end"
                  : "self-start bg-[#CC155E33] text-[#CC155E]"
              )}
            >
              {item.role === "assistant" && <img src={logo.src} alt="logo" />}
              {item.formatted.transcript}
            </div>
          )
      )}

      <Button
        onClick={isConnected ? disconnectConversation : connectConversation}
      >
        {isConnected ? "disconnect" : "connect"}
      </Button>
    </div>
  );
};
