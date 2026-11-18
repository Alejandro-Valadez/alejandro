# Alejandro icons

`alejandro/mark.svg` is the source of truth for this fork. Run `vp run icons:export` to regenerate web, desktop, iOS, and Android artwork on Linux, macOS, or Windows. Run `vp run icons:check` to verify the tracked exports.

The exporter uses the existing Sharp dependency. macOS icons have an 824-pixel body centered in a transparent 1024-pixel canvas; Android foregrounds leave room for the platform mask. Existing output filenames remain compatible with the upstream build scripts.

The original Icon Composer projects are retained for optional native editing; they are not the source used by the fork's export command.
