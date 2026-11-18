import { runAtomCommand } from "@t3tools/client-runtime/state/runtime";
import type { EnvironmentId } from "@t3tools/contracts";
import { Link } from "@tanstack/react-router";
import { useGT, useMessages } from "gt-react";
import { BrainIcon, CalendarClockIcon, MessageCircleIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { useQuickChat } from "../../hooks/useQuickChat";
import { useScratchProject } from "../../hooks/useScratchProject";
import { appAtomRegistry } from "~/rpc/atomRegistry";
import { projectEnvironment } from "../../state/projects";
import { useEnvironmentQuery } from "../../state/query";
import { serverEnvironment } from "../../state/server";
import { scheduleLabel } from "../settings/scheduledTasksSettings.logic";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { SidebarInset } from "../ui/sidebar";
import { Textarea } from "../ui/textarea";
import { toastManager } from "../ui/toast";
import { ASSISTANT_MEMORY_FILE, memoryDraftState } from "./assistant.logic";

export function AssistantPage() {
  const gt = useGT();
  const scratch = useScratchProject();
  const environmentId = scratch.scratchEnvironmentId(null);
  const root = scratch.scratchWorkspaceRootFor(environmentId);
  const quickChat = useQuickChat();

  return (
    <SidebarInset className="h-dvh min-h-0 overflow-y-auto scrollbar-gutter-both">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">{gt("Assistant")}</h1>
            <p className="text-sm text-muted-foreground">
              {gt("What your assistant remembers, and what it does on a schedule.")}
            </p>
          </div>
          <Button
            disabled={!quickChat.available || quickChat.isStarting}
            onClick={() => void quickChat.startQuickChat()}
          >
            <MessageCircleIcon />
            {gt("Chat")}
          </Button>
        </header>
        {environmentId !== null && root !== null ? (
          <>
            <AssistantMemory environmentId={environmentId} cwd={root} />
            <AssistantRoutines environmentId={environmentId} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {gt("Connect to your server to use the assistant.")}
          </p>
        )}
      </div>
    </SidebarInset>
  );
}

function AssistantMemory({ environmentId, cwd }: { environmentId: EnvironmentId; cwd: string }) {
  const gt = useGT();
  const file = useEnvironmentQuery(
    projectEnvironment.readFile({
      environmentId,
      input: { cwd, relativePath: ASSISTANT_MEMORY_FILE },
    }),
  );
  const [draft, setDraft] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const saved = file.data?.exists === false ? "" : (file.data?.contents ?? null);
  const state = memoryDraftState(saved, draft);

  const save = async () => {
    if (!state.dirty) return;
    setSaving(true);
    const result = await runAtomCommand(appAtomRegistry, projectEnvironment.writeFile, {
      environmentId,
      input: { cwd, relativePath: ASSISTANT_MEMORY_FILE, contents: state.value },
    });
    setSaving(false);
    if (result._tag === "Success") {
      setDraft(null);
      file.refresh();
    } else {
      toastManager.add({ type: "error", title: gt("Could not save memory. Try again.") });
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-medium">
          <BrainIcon className="size-4" />
          {gt("Memory")}
        </h2>
        <Button size="sm" disabled={!state.dirty || saving} onClick={() => void save()}>
          {saving ? gt("Saving…") : gt("Save")}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {gt("Saved as {file} on your server. Quick Chat reads it at the start of every chat.", {
          file: ASSISTANT_MEMORY_FILE,
        })}
      </p>
      <Textarea
        aria-label={gt("Assistant memory")}
        className="min-h-64"
        disabled={saved === null && file.error === null}
        placeholder={gt("Facts, preferences and standing instructions for your assistant.")}
        value={state.value}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "s") {
            event.preventDefault();
            void save();
          }
        }}
      />
      {file.error ? <p className="text-xs text-destructive">{file.error}</p> : null}
    </section>
  );
}

function AssistantRoutines({ environmentId }: { environmentId: EnvironmentId }) {
  const gt = useGT();
  const m = useMessages();
  const query = useEnvironmentQuery(
    serverEnvironment.scheduledTasksLive({ environmentId, input: {} }),
  );
  const tasks = query.data?.tasks ?? [];

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-medium">
          <CalendarClockIcon className="size-4" />
          {gt("Routines")}
        </h2>
        <Button
          size="sm"
          variant="outline"
          render={<Link to="/settings/scheduled-tasks" search={{ environmentId }} />}
        >
          <PlusIcon />
          {gt("New routine")}
        </Button>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {query.isPending ? gt("Loading…") : gt("No routines yet.")}
        </p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link
                className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-accent"
                to="/settings/scheduled-tasks"
                search={{ environmentId, taskId: task.id }}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm">{task.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {scheduleLabel(task.schedule, query.data?.timeZone, task.nextRunAt, m)}
                  </span>
                </span>
                <Badge variant={task.enabled ? "success" : "outline"}>
                  {task.enabled ? gt("On") : gt("Off")}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
