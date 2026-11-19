import { useGT } from "gt-react";
import {
  BoldIcon,
  ChevronDownIcon,
  ItalicIcon,
  LinkIcon,
  PaintbrushIcon,
  PrinterIcon,
  Redo2Icon,
  SpellCheckIcon,
  StarIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";

import { useClientSettings } from "../../hooks/useSettings";

// A font name, the same in every language.
const DOCS_FONT_NAME = "Arial";

/** Decorative document-editor chrome shown above a thread while Docs mode is on. */
export function DocsModeToolbar({ title }: { title: string | null }) {
  const gt = useGT();
  const enabled = useClientSettings((settings) => settings.docsModeEnabled);
  if (!enabled) return null;
  const menus = [
    gt("File"),
    gt("Edit"),
    gt("View"),
    gt("Insert"),
    gt("Format"),
    gt("Tools"),
    gt("Extensions"),
    gt("Help"),
  ];
  return (
    <div data-docs-toolbar aria-hidden="true">
      <div data-docs-title-row>
        <svg data-docs-icon viewBox="0 0 48 48">
          <path
            data-docs-icon-page
            d="M29 4H12a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V15z"
          />
          <path data-docs-icon-fold d="M29 4v11h11z" />
          <path data-docs-icon-lines d="M16 23h16v2.5H16zm0 6h16v2.5H16zm0 6h11v2.5H16z" />
        </svg>
        <div data-docs-title-block>
          <div data-docs-title-line>
            <span data-docs-title>{title?.trim() || gt("Untitled document")}</span>
            <StarIcon />
          </div>
          <div data-docs-menus>
            {menus.map((menu) => (
              <span key={menu}>{menu}</span>
            ))}
          </div>
        </div>
        <span data-docs-share>{gt("Share")}</span>
      </div>
      <div data-docs-format-bar>
        <Undo2Icon />
        <Redo2Icon />
        <PrinterIcon />
        <SpellCheckIcon />
        <PaintbrushIcon />
        <span data-docs-divider />
        <span data-docs-select>
          100%
          <ChevronDownIcon />
        </span>
        <span data-docs-divider />
        <span data-docs-select>
          {gt("Normal text")}
          <ChevronDownIcon />
        </span>
        <span data-docs-divider />
        <span data-docs-select>
          {DOCS_FONT_NAME}
          <ChevronDownIcon />
        </span>
        <span data-docs-divider />
        <span data-docs-select>11</span>
        <span data-docs-divider />
        <BoldIcon />
        <ItalicIcon />
        <UnderlineIcon />
        <span data-docs-divider />
        <LinkIcon />
      </div>
    </div>
  );
}
