<p align="center"><img src="./assets/alejandro/mark.svg" width="80" height="80" alt="Alejandro logo" /></p>
<h1 align="center">Alejandro</h1>

A personal workspace for AI conversations and coding agents, with your existing provider logins.

## Quick Chat

Use **Quick Chat** beside the sidebar's search/new-thread controls, or find it in the command palette. It starts a conversation in **No project**, selects Claude Haiku from a ready Claude provider, and keeps normal tools and permission controls available. If Claude or Haiku is unavailable, it explains how to connect them instead of silently choosing another model.

Quick Chat is available in the web UI and the desktop app that wraps it. Native mobile keeps its existing new-chat flow.

## Run this fork

The customized version is on `feat/alejandro-quick-chat`. There are no packaged Alejandro releases yet; upstream package-manager commands install the upstream app.

```bash
git clone --branch feat/alejandro-quick-chat https://github.com/Alejandro-Valadez/alejandro.git
cd alejandro
vp install --frozen
vp run dev --home-dir "$PWD/.alejandro-dev" --no-seed
```

Use the Node and Vite+ versions described in the [development runbook](./docs/operations/development.md#first-checkout). To reach the development server from another device on your tailnet, add `--share` and use the pairing URL printed by the server. Keep that URL private.

Packaged desktop and server instances default to a separate `.alejandro` data directory. Existing provider credentials remain managed by their providers. Internal `@t3tools` packages, `t3` CLI commands, `T3CODE_*` environment variables, and link protocols retain their names for compatibility.

## More capabilities

- Switch between provider accounts and models.
- Review files, diffs, terminals, and Git changes in one workspace.
- Connect to remote environments over Tailscale or SSH.
- Use the inherited scheduling, browser, and agent tools.

[User documentation](./docs/README.md) and [architecture](./docs/internals/overview.md) describe the underlying app. Some upstream docs and integrations retain their original names.

## License and origin

Alejandro is an independent fork of [T3 Code](https://github.com/pingdotgg/t3code), originally developed by T3 Tools and its contributors. It is not an official T3 Tools release. The [MIT license](./LICENSE) and original copyright notices are preserved.
