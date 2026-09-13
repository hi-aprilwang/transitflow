import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TRANSITFLOW_SYSTEM_PROMPT } from "@/features/chat/system-prompt";
import { getSimulatedSpatialResponse } from "@/features/chat/fallback-service";

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1, "Message content cannot be empty").max(4000),
      })
    )
    .min(1, "At least one message is required"),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  max_tokens: z.number().min(100).max(4096).optional().default(3000),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = chatRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid request payload",
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { messages, temperature, max_tokens } = parseResult.data;
    const lastUserMessage =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";

    // 1. Deadline Killswitch (quietly active for 25 Sept 2026)
    const expiryDateStr =
      process.env.COMMANDCODE_EXPIRY_DATE || "2026-09-25T00:00:00+07:00";
    const expiryTimestamp = new Date(expiryDateStr).getTime();

    if (Date.now() >= expiryTimestamp) {
      return NextResponse.json({
        role: "assistant",
        content: getSimulatedSpatialResponse(lastUserMessage),
        model: "transitflow-spatial-copilot",
        offline: true,
        expired: true,
      });
    }

    // 2. Check API Key
    const apiKey =
      (process.env.COMMANDCODE_API_KEY &&
        process.env.COMMANDCODE_API_KEY !== "your_commandcode_api_key_here")
        ? process.env.COMMANDCODE_API_KEY
        : process.env.NODE_ENV === "test"
          ? ""
          : "user_C184idba71VNZM3rQmZTKu2oafhcASVpg6boXVQ16SvJxYac3emU7xCF1MSLm7ANnYcqB393NuRWb8wcygksGff";
    const model =
      process.env.COMMANDCODE_MODEL || "deepseek/deepseek-v4.1-flash";

    if (!apiKey) {
      return NextResponse.json({
        role: "assistant",
        content: getSimulatedSpatialResponse(lastUserMessage),
        model: "transitflow-spatial-copilot",
        offline: true,
        expired: false,
      });
    }

    // 3. Outbound request to CommandCode Provider API
    const commandCodeUrl =
      "https://api.commandcode.ai/provider/v1/chat/completions";

    const outgoingMessages = [
      { role: "system", content: TRANSITFLOW_SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const requestedTokens = Math.max(2500, max_tokens || 3000);

    const response = await fetch(commandCodeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: outgoingMessages,
        max_tokens: requestedTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `CommandCode API error (${response.status}):`,
        errorText
      );

      return NextResponse.json({
        role: "assistant",
        content: getSimulatedSpatialResponse(lastUserMessage),
        model,
        offline: true,
        expired: false,
      });
    }

    const data = await response.json();
    const choice = data?.choices?.[0];
    const message = choice?.message;
    let content = message?.content || "";
    const reasoning = message?.reasoning || undefined;

    // Safety fallback if model burned all tokens in reasoning
    if (!content.trim()) {
      if (reasoning && reasoning.trim()) {
        content = reasoning;
      } else {
        content = getSimulatedSpatialResponse(lastUserMessage);
      }
    }

    return NextResponse.json({
      role: "assistant",
      content,
      reasoning,
      model: data?.model || model,
      offline: false,
      expired: false,
    });
  } catch (error) {
    console.error("Chat API route unexpected error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
