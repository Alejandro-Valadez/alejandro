import { scopeProjectRef } from "@t3tools/client-runtime/environment";
import { useRouter } from "@tanstack/react-router";
import { useGT } from "gt-react";
import { useRef, useState } from "react";
import { toastManager } from "~/components/ui/toast";
import { quickChatModel } from "~/lib/quickChat";
import { appAtomRegistry } from "~/rpc/atomRegistry";
import { environmentServerConfigsAtom } from "~/state/server";
import { useNewThreadHandler } from "./useHandleNewThread";
import { useScratchProject } from "./useScratchProject";

export function useQuickChat() {
  const gt = useGT();
  const router = useRouter();
  const scratch = useScratchProject();
  const handleNewThread = useNewThreadHandler();
  const pending = useRef(false);
  const [isStarting, setIsStarting] = useState(false);
  const environmentId = scratch.scratchEnvironmentId(null);

  const startQuickChat = async () => {
    if (pending.current || environmentId === null) return;
    const selection = quickChatModel(
      appAtomRegistry.get(environmentServerConfigsAtom).get(environmentId)?.providers ?? [],
    );
    if (selection === null) {
      toastManager.add({
        type: "error",
        title: gt("Connect Claude for Quick Chat"),
        description: gt(
          "Enable a signed-in Claude provider with Haiku in Settings, then try again.",
        ),
      });
      return;
    }
    pending.current = true;
    setIsStarting(true);
    const href = router.state.location.href;
    await scratch
      .openScratchProject(environmentId)
      .then(async (project) => {
        if (!project || router.state.location.href !== href) return;
        await handleNewThread(scopeProjectRef(project.environmentId, project.id), {
          envMode: "local",
          modelSelection: selection,
          interactionMode: "default",
        });
      })
      .catch(() => {
        toastManager.add({ type: "error", title: gt("Could not open Quick Chat. Try again.") });
      })
      .finally(() => {
        pending.current = false;
        setIsStarting(false);
      });
  };

  return { startQuickChat, isStarting, available: environmentId !== null };
}
