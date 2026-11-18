#!/usr/bin/env node
// @effect-diagnostics nodeBuiltinImport:off globalConsole:off - Deterministic asset-generation CLI.
import * as NodeFSP from "node:fs/promises";
import * as NodePath from "node:path";
import sharp from "sharp";
import { BRAND_ASSET_PATHS, DEVELOPMENT_PUBLIC_ICON_OVERRIDES } from "./lib/brand-assets.ts";
import { encodePngIco, WINDOWS_ICON_SIZES } from "./lib/icon-export.ts";

const root = NodePath.resolve(import.meta.dirname, "..");
const check = process.argv.includes("--check");
const source = await NodeFSP.readFile(NodePath.join(root, "assets/alejandro/mark.svg"), "utf8");
const render = (size: number) => sharp(Buffer.from(source)).resize(size, size).png().toBuffer();
const ico = encodePngIco(
  await Promise.all(
    WINDOWS_ICON_SIZES.map(async (size) => ({ size, contents: await render(size) })),
  ),
);
const mac = await sharp({
  create: { width: 1024, height: 1024, channels: 4, background: "#00000000" },
})
  .composite([{ input: await render(824), left: 100, top: 100 }])
  .png()
  .toBuffer();
const outputs = new Map<string, Buffer>();
for (const path of Object.values(BRAND_ASSET_PATHS)) {
  if (path.endsWith(".icon")) continue;
  const size = path.includes("16x16")
    ? 16
    : path.includes("32x32")
      ? 32
      : path.includes("180")
        ? 180
        : path.includes("192")
          ? 192
          : path.includes("512")
            ? 512
            : 1024;
  outputs.set(
    path,
    path.endsWith(".ico") ? ico : path.includes("macos") ? mac : await render(size),
  );
}
for (const { sourceRelativePath, targetRelativePath } of DEVELOPMENT_PUBLIC_ICON_OVERRIDES) {
  const image = outputs.get(sourceRelativePath);
  if (!image) throw new Error(`Missing generated icon: ${sourceRelativePath}`);
  outputs.set(targetRelativePath, image);
}
const foreground = source.replace(/<rect[^>]*\/>/, "");
const androidForeground = (size: number) =>
  sharp({ create: { width: size, height: size, channels: 4, background: "#00000000" } })
    .composite([
      {
        input: Buffer.from(
          foreground.replace(
            'viewBox="0 0 1024 1024"',
            `width="${Math.round(size * 0.72)}" height="${Math.round(size * 0.72)}" viewBox="0 0 1024 1024"`,
          ),
        ),
        gravity: "centre",
      },
    ])
    .png()
    .toBuffer();
outputs.set("apps/mobile/assets/android-icon-foreground.png", await androidForeground(432));
outputs.set("apps/mobile/assets/android-icon-mark.png", await androidForeground(432));
for (const variant of ["dev", "nightly", "prod"]) {
  const splash = await sharp({
    create: { width: 1152, height: 1152, channels: 4, background: "#172554" },
  })
    .composite([{ input: await androidForeground(1152) }])
    .png()
    .toBuffer();
  outputs.set(`apps/mobile/assets/android-splash-icon-${variant}.png`, splash);
  if (variant !== "prod")
    outputs.set(
      `apps/mobile/assets/android-icon-background-${variant}.png`,
      await sharp({ create: { width: 432, height: 432, channels: 4, background: "#172554" } })
        .png()
        .toBuffer(),
    );
}
for (const [path, contents] of outputs) {
  const fullPath = NodePath.join(root, path);
  if (check) {
    if (!(await NodeFSP.readFile(fullPath)).equals(contents))
      throw new Error(`Icon is stale: ${path}`);
  } else await NodeFSP.writeFile(fullPath, contents);
}
console.log(`${check ? "Verified" : "Generated"} ${outputs.size} Alejandro icons.`);
