/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "~/components/ui/button";
import type { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
import { LogoIcon } from "./icons/LogoIcon";
import { MicrophoneIcon } from "./icons/MicrophoneIcon";
import { RealtimeClient } from "@openai/realtime-api-beta";
import StopIcon from "./icons/StopIcon";
import { WavRecorder } from "../lib/wavtools";
import { instructions } from "~/lib/conversation-config";
import { useContextState } from "~/context/ContextProvider";

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

const DEBUG = false;

export const VoiceRecorder = ({
  addTranscriptToEditor,
  improveTranscript,
}: {
  previousTranscript: string | null;
  addTranscriptToEditor: (transcript: string) => void;
  updateDocumentTitle: (title: string) => void;
  improveTranscript: () => void;
}) => {
  /**
   * Ask user for API Key
   * If we're using the local relay server, we don't need this
   */
  const apiKey = LOCAL_RELAY_SERVER_URL
    ? ""
    : (localStorage.getItem("tmp::voice_api_key") ?? prompt("OpenAI API Key") ?? "");
  if (apiKey !== "") {
    localStorage.setItem("tmp::voice_api_key", apiKey);
  }

  /**
   * Instantiate:
   * - WavRecorder (speech input)
   * - RealtimeClient (API client)
   */
  const wavRecorderRef = useRef<WavRecorder>(new WavRecorder({ sampleRate: 24000 }));
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient(
      LOCAL_RELAY_SERVER_URL
        ? { url: LOCAL_RELAY_SERVER_URL }
        : {
            apiKey: apiKey,
            dangerouslyAllowAPIKeyInBrowser: true,
          },
    ),
  );

  /**
   * All of our variables for displaying application state
   * - items are all conversation items (dialog)
   */
  const [items, setItems] = useState<ItemType[]>([]);
  const { addContext } = useContextState();
  const [isConnected, setIsConnected] = useState(false);
  // Add this new state for the last assistant message
  const [lastAssistantMessage, setLastAssistantMessage] = useState<string | null>(null);

  // Add this line to create an audio element reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * Connect to conversation:
   * WavRecorder taks speech input, client is API client
   */
  const connectConversation = useCallback(async () => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;

    // Set state variables
    setIsConnected(true);

    setItems(client.conversation.getItems());

    // Connect to microphone
    await wavRecorder.begin();

    // Play the sound when recording starts
    if (audioRef.current) {
      audioRef.current.src = "/rising-pops.mp3";
      audioRef.current.play();
    }

    // Connect to realtime API
    await client.connect();

    if (client.getTurnDetectionType() === "server_vad") {
      await wavRecorder.record(data => client.appendInputAudio(data.mono));
    }
  }, []);

  /**
   * Disconnect and reset conversation state
   * TODO: send last recording before disconnecting the client
   */
  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    // Play the sound when recording ends
    if (audioRef.current) {
      audioRef.current.src = "/disable-sound.mp3";
      audioRef.current.play();
    }

    improveTranscript();
  }, [improveTranscript]);

  /**
   * Core RealtimeClient and audio capture setup
   * Set all of our instructions, tools, events and more
   */
  useEffect(() => {
    // Get refs
    const client = clientRef.current;

    // Set instructions
    client.updateSession({
      turn_detection: {
        type: "server_vad",
        // TODO: play around more with these values
        threshold: 0.5,
        prefix_padding_ms: 500,
        silence_duration_ms: 1000,
      },
      instructions: instructions,
      // instructions: instructions(previousTranscript ?? ""),
    });

    // Set transcription, otherwise we don't get user transcriptions back
    client.updateSession({ input_audio_transcription: { model: "whisper-1" } });

    client.addTool(
      {
        name: "add_context",
        description:
          "When touching on new topics, add context to enrich the conversation with fascinating facts, research findings, and expert insights related to the current topic. Examples: For microplastics - latest research debunking common myths, for books - author background and transformative ideas, for psychology - practical applications and assessment methods.",
        parameters: {
          type: "object",
          properties: {
            value: {
              type: "string",
              description:
                "High-value contextual information that deepens understanding of the topic, such as: recent research findings that challenge common beliefs, expert insights from primary sources, practical applications or examples, historical context that shapes current understanding, statistical data from reputable sources, or methodological insights that explain how we know what we know. For books, include author credentials, key concepts, and real-world impact. For scientific topics, include latest research findings and methodology improvements. For psychological concepts, include assessment methods and practical applications.",
            },
          },
          required: ["value"],
        },
      },
      async ({ value }: { [key: string]: any }) => {
        console.log("[add_context]", value);

        addContext(value);
        return { ok: true };
      },
    );

    client.on("error", (event: any) => console.error(event));

    client.on("conversation.item.appended", async ({ item, delta }: any) => {
      console.log("[conversation.item.appended]", item, delta);
    });
    client.on("conversation.updated", async ({ item, delta }: any) => {
      const items = client.conversation.getItems();
      console.log("[conversation.updated]", item, delta);

      setItems(items);

      // Add user transcript to the editor
      if (item.role === "user" && item.formatted.transcript) {
        addTranscriptToEditor(item.formatted.transcript);
      }

      // Update the last assistant message when a new message from the assistant is received
      if (item.role === "assistant" && (item.formatted.transcript || item.formatted.text)) {
        setLastAssistantMessage(item.formatted.transcript || item.formatted.text);
      }
    });

    setItems(client.conversation.getItems());

    return () => {
      // cleanup; resets to defaults
      client.reset();
    };
  }, []);

  return (
    <div className="mb-4 flex flex-col items-center justify-between gap-4">
      <audio ref={audioRef} src="/rising-pops.mp3" />
      {items.map(conversationItem => {
        return (
          DEBUG && (
            <div className="conversation-item flex gap-2 rounded bg-slate-100 p-4" key={conversationItem.id}>
              <div className={`speaker ${conversationItem.role || ""}`}>
                <div>{(conversationItem.role || conversationItem.type).replaceAll("_", " ")}</div>
              </div>
              <div className={`speaker-content`}>
                {/* tool response */}
                {conversationItem.type === "function_call_output" && <div>{conversationItem.formatted.output}</div>}
                {/* tool call */}
                {!!conversationItem.formatted.tool && (
                  <div>
                    tool:
                    {conversationItem.formatted.tool.name}({conversationItem.formatted.tool.arguments})
                  </div>
                )}
                {!conversationItem.formatted.tool && conversationItem.role === "user" && (
                  <div>
                    {conversationItem.formatted.transcript ||
                      (conversationItem.formatted.audio?.length
                        ? "(awaiting transcript)"
                        : conversationItem.formatted.text || "(item sent)")}
                  </div>
                )}
                {!conversationItem.formatted.tool && conversationItem.role === "assistant" && (
                  <div>{conversationItem.formatted.transcript || conversationItem.formatted.text || "(truncated)"}</div>
                )}
              </div>
            </div>
          )
        );
      })}
      <Button
        onClick={isConnected ? disconnectConversation : connectConversation}
        variant={isConnected ? "default" : "brand"}
        size="icon"
        className={`absolute right-4 top-4 ${isConnected ? "animate-pulse" : ""}`}
      >
        {isConnected ? <StopIcon /> : <MicrophoneIcon />}
      </Button>

      {lastAssistantMessage && (
        <div className="absolute bottom-4 left-1/2 flex w-full max-w-md -translate-x-1/2 gap-2 rounded-lg  bg-[#CC155E]/20 p-4 text-[#CC155E] shadow-lg">
          <LogoIcon className="size-6 shrink-0" />
          <p className="text-sm">{lastAssistantMessage}</p>
        </div>
      )}
    </div>
  );
};
