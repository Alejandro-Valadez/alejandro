import { ProviderDriverKind, type ModelSelection, type ServerProvider } from "@t3tools/contracts";

const CLAUDE_DRIVER = ProviderDriverKind.make("claudeAgent");

export function quickChatModel(providers: ReadonlyArray<ServerProvider>): ModelSelection | null {
  for (const provider of providers) {
    if (
      provider.driver !== CLAUDE_DRIVER ||
      !provider.enabled ||
      !provider.installed ||
      provider.status !== "ready" ||
      provider.availability === "unavailable"
    )
      continue;
    const models = provider.models.filter((model) => /haiku/i.test(model.slug));
    const model = models.find((entry) => !entry.isLegacy) ?? models[0];
    if (model) return { instanceId: provider.instanceId, model: model.slug };
  }
  return null;
}
