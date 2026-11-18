import { ProviderInstanceId, ProviderDriverKind, type ServerProvider } from "@t3tools/contracts";
import { describe, expect, it } from "vite-plus/test";
import { quickChatModel } from "./quickChat";

const provider = (overrides: Partial<ServerProvider> = {}): ServerProvider => ({
  instanceId: ProviderInstanceId.make("claude-personal"),
  driver: ProviderDriverKind.make("claudeAgent"),
  enabled: true,
  installed: true,
  status: "ready",
  auth: { status: "authenticated" },
  version: null,
  checkedAt: "2026-11-18T00:00:00.000Z",
  models: [
    { slug: "claude-opus", name: "Opus", isCustom: false, capabilities: null },
    {
      slug: "claude-haiku-old",
      name: "Old Haiku",
      isCustom: false,
      isLegacy: true,
      capabilities: null,
    },
    { slug: "claude-haiku-current", name: "Haiku", isCustom: false, capabilities: null },
  ],
  slashCommands: [],
  skills: [],
  ...overrides,
});

describe("quickChatModel", () => {
  it("uses a ready Claude instance's current Haiku and does not inherit expensive options", () => {
    expect(quickChatModel([provider({ enabled: false }), provider()])).toEqual({
      instanceId: "claude-personal",
      model: "claude-haiku-current",
    });
  });

  it("does not substitute a different provider or select unavailable models", () => {
    for (const entry of [
      provider({ installed: false }),
      provider({ enabled: false }),
      provider({ availability: "unavailable" }),
      provider({ driver: ProviderDriverKind.make("codex") }),
      provider({ models: [] }),
    ])
      expect(quickChatModel([entry])).toBeNull();
    expect(quickChatModel([])).toBeNull();
  });
});
