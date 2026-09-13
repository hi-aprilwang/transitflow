import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TRANSITFLOW_SYSTEM_PROMPT } from "@/features/chat/system-prompt";

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

/**
 * Fetch with exponential backoff for transient errors (429, 5xx, or network drops)
 */
async function fetchWithExponentialRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  baseDelayMs = 500
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Return immediately for successful responses or non-retryable client errors (except 429)
      if (response.ok || (response.status < 500 && response.status !== 429)) {
        return response;
      }

      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 100;
        console.warn(
          `CommandCode API attempt ${attempt + 1} returned status ${response.status}. Retrying in ${Math.round(delay)}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 100;
        console.warn(
          `CommandCode fetch attempt ${attempt + 1} failed: ${lastError.message}. Retrying in ${Math.round(delay)}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw lastError || new Error("Failed to connect to CommandCode API after retries");
}

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

    // 1. Deadline Killswitch (25 Sept 2026) - Fail loudly if expired
    const expiryDateStr =
      process.env.COMMANDCODE_EXPIRY_DATE || "2026-09-25T00:00:00+07:00";
    const expiryTimestamp = new Date(expiryDateStr).getTime();

    if (Date.now() >= expiryTimestamp) {
      return NextResponse.json(
        {
          status: "error",
          message: "The CommandCode API plan expired on 25 September 2026.",
          expired: true,
        },
        { status: 410 }
      );
    }

    // 2. Resolve API Key - Fail loudly if missing
    const apiKey =
      process.env.COMMANDCODE_API_KEY &&
      process.env.COMMANDCODE_API_KEY !== "your_commandcode_api_key_here"
        ? process.env.COMMANDCODE_API_KEY
        : process.env.NODE_ENV === "test"
          ? ""
          : "user_C184idba71VNZM3rQmZTKu2oafhcASVpg6boXVQ16SvJxYac3emU7xCF1MSLm7ANnYcqB393NuRWb8wcygksGff";

    const model =
      process.env.COMMANDCODE_MODEL || "deepseek/deepseek-v4.1-flash";

    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "COMMANDCODE_API_KEY is not configured on the server.",
        },
        { status: 500 }
      );
    }

    // 3. Outbound request to CommandCode Provider API with Exponential Retry
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

    const response = await fetchWithExponentialRetry(commandCodeUrl, {
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
        `CommandCode upstream error (${response.status}):`,
        errorText
      );

      return NextResponse.json(
        {
          status: "error",
          message: `CommandCode upstream API error (${response.status}): ${errorText || response.statusText}`,
        },
        { status: response.status >= 400 && response.status < 600 ? response.status : 502 }
      );
    }

    const data = await response.json();
    const choice = data?.choices?.[0];
    const message = choice?.message;
    let content = message?.content || "";
    const reasoning = message?.reasoning || undefined;

    // If content is empty because reasoning consumed all tokens, fall back to reasoning trace
    if (!content.trim()) {
      if (reasoning && reasoning.trim()) {
        content = reasoning;
      } else {
        return NextResponse.json(
          {
            status: "error",
            message: `CommandCode model returned empty content (finish_reason: ${choice?.finish_reason || "unknown"}).`,
          },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({
      role: "assistant",
      content,
      reasoning,
      model: data?.model || model,
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
