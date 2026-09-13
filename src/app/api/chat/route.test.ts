import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

describe("POST /api/chat", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("returns 400 when request body has invalid payload", async () => {
    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.status).toBe("error");
  });

  it("triggers killswitch and returns 410 when expiry date has passed", async () => {
    process.env.COMMANDCODE_EXPIRY_DATE = "2020-01-01T00:00:00+07:00";
    process.env.COMMANDCODE_API_KEY = "dummy-key";

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "What is the VCI status?" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(410);

    const data = await res.json();
    expect(data.status).toBe("error");
    expect(data.message).toContain("CommandCode API plan expired");
  });

  it("fails loudly with 500 when API key is missing", async () => {
    process.env.COMMANDCODE_EXPIRY_DATE = "2099-01-01T00:00:00+07:00";
    process.env.COMMANDCODE_API_KEY = "";

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "Tell me about Dukuh Atas" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.status).toBe("error");
    expect(data.message).toContain("COMMANDCODE_API_KEY is not configured");
  });

  it("calls CommandCode and returns assistant response when key and date are valid", async () => {
    process.env.COMMANDCODE_EXPIRY_DATE = "2099-01-01T00:00:00+07:00";
    process.env.COMMANDCODE_API_KEY = "test_commandcode_key";
    process.env.COMMANDCODE_MODEL = "deepseek/deepseek-v4.1-flash";

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              role: "assistant",
              content: "Dukuh Atas pedestrian flow is at 45 p/min/m.",
              reasoning: "Checking station telemetry...",
            },
          },
        ],
        model: "deepseek/deepseek-v4.1-flash",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "What is the flow at Dukuh Atas?" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.role).toBe("assistant");
    expect(data.content).toBe("Dukuh Atas pedestrian flow is at 45 p/min/m.");
    expect(data.reasoning).toBe("Checking station telemetry...");
    expect(data.model).toBe("deepseek/deepseek-v4.1-flash");
  });

  it("retries on transient failure with exponential backoff and succeeds on retry", async () => {
    process.env.COMMANDCODE_EXPIRY_DATE = "2099-01-01T00:00:00+07:00";
    process.env.COMMANDCODE_API_KEY = "test_commandcode_key";

    let calls = 0;
    const mockFetch = vi.fn().mockImplementation(async () => {
      calls++;
      if (calls === 1) {
        return {
          ok: false,
          status: 503,
          text: async () => "Service Unavailable",
        };
      }
      return {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                role: "assistant",
                content: "Success on retry!",
              },
            },
          ],
          model: "deepseek/deepseek-v4.1-flash",
        }),
      };
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "Test retry" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.content).toBe("Success on retry!");
    expect(calls).toBe(2);
  });

  it("fails loudly when upstream returns error after retries exhausted", async () => {
    process.env.COMMANDCODE_EXPIRY_DATE = "2099-01-01T00:00:00+07:00";
    process.env.COMMANDCODE_API_KEY = "test_commandcode_key";

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      text: async () => "Bad Gateway",
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "Is it raining at Dukuh Atas?" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(502);

    const data = await res.json();
    expect(data.status).toBe("error");
    expect(data.message).toContain("CommandCode upstream API error (502)");
  });
});
