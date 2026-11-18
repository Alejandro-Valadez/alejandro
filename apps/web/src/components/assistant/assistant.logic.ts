/** Lives in the scratch workspace root, so Quick Chat's Claude threads load it as project memory. */
export const ASSISTANT_MEMORY_FILE = "CLAUDE.md";

/** An untouched draft shows the saved file; a loading file stays empty and clean. */
export function memoryDraftState(saved: string | null, draft: string | null) {
  const value = draft ?? saved ?? "";
  return { value, dirty: draft !== null && draft !== (saved ?? "") };
}
