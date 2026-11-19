import { msg } from "gt-react";

import { m } from "./i18n/messages";

/** Docs mode reskins the app as a document editor. Theme code reads the flag to force light. */
let active = false;
let savedFavicon: string | null = null;

const DOCS_FAVICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4285f4" d="M29 4H12a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V15z"/><path fill="#a1c2fa" d="M29 4v11h11z"/><path fill="#fff" d="M16 23h16v2.5H16zm0 6h16v2.5H16zm0 6h11v2.5H16z"/></svg>',
)}`;

export function isDocsModeActive(): boolean {
  return active;
}

/** Returns whether the flag changed, so the caller knows to re-apply the theme. */
export function setDocsModeActive(next: boolean): boolean {
  if (next === active) return false;
  active = next;
  if (typeof document === "undefined") return true;
  const root = document.documentElement;
  if (next) root.dataset.docsMode = "true";
  else delete root.dataset.docsMode;
  const icon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
  if (icon) {
    if (next) {
      savedFavicon = icon.href;
      icon.href = DOCS_FAVICON;
    } else if (savedFavicon !== null) {
      icon.href = savedFavicon;
      savedFavicon = null;
    }
  }
  return true;
}

export function docsModeWindowTitle(threadTitle: string | null): string {
  const title = threadTitle?.trim() || m(msg("Untitled document"));
  return m(msg("{title} - Docs", { title }));
}
