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

  it("triggers killswitch when expiry date has passed", async () => {
    process.env.COMMANDCODE_EXPIRY_DATE = "2020-01-01T00:00:00+07:00";
    process.env.COMMANDCODE_API_KEY = "dummy-key";

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "What is the VCI status?" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.expired).toBe(true);
    expect(data.offline).toBe(true);
    expect(data.content).toContain("Security Guardrail Active");
    expect(data.content).toContain("Vendor Crowding Index");
  });

  it("returns offline mode response when API key is missing or default placeholder", async () => {
    process.env.COMMANDCODE_EXPIRY_DATE = "2099-01-01T00:00:00+07:00";
    process.env.COMMANDCODE_API_KEY = "";

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "Tell me about Dukuh Atas" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.offline).toBe(true);
    expect(data.content).toContain("Dukuh Atas Multi-Modal Hub");
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
    expect(data.offline).toBe(false);
  });

  it("gracefully falls back when upstream returns 500 error", async () => {
    process.env.COMMANDCODE_EXPIRY_DATE = "2099-01-01T00:00:00+07:00";
    process.env.COMMANDCODE_API_KEY = "test_commandcode_key";

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });
    vi.stubGlobal("fetch", mockFetch);

    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "Is it raining at Dukuh Atas?" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.offline).toBe(true);
    expect(data.content).toContain("CommandCode upstream returned status 500");
  });
});
