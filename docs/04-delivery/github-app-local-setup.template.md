# GitHub App Local Setup Template

This template describes the private setup information a Lead Orchestrator may need during onboarding to publish repository changes through the approved GitHub App.

This file is not the source of truth for secrets. Real credentials must be provided through a secure, owner-controlled channel.

Do not commit filled-in versions of this file. Do not paste secrets into pull requests, commits, logs, comments, or documentation.

## Required owner-provided setup

- App name: `Cesar-IA-Agent`
- App ID: `<APP_ID>`
- Installation ID: `<INSTALLATION_ID>`
- Private key location: `<PRIVATE_KEY_LOCATION>`
- Token generation command or helper: `<TOKEN_GENERATION_COMMAND>`
- Owner-provided setup notes: `<OWNER_PROVIDED_SETUP>`

## Verification checklist

Before publishing repository changes:

- confirm the GitHub App identity resolves to `Cesar-IA-Agent`;
- confirm commits and pull requests will be published as `cesar-ia-agent[bot]`;
- confirm no personal GitHub credentials are being used;
- confirm no private key, JWT, installation token, or credential value is printed or stored in versioned files.

If any part of the setup is unavailable, expired, misconfigured, or unclear, stop and ask the CEO/Owner for access.
