# Sign In Test Mini App

This is a simple Farcaster Mini App example that demonstrates the sign-in functionality using `@farcaster/miniapp-sdk`.

## Features

- Calls `sdk.actions.ready()` on mount to properly initialize as a mini-app
- Shows a "Sign in with Farcaster" button
- Uses `sdk.actions.signIn()` with a random nonce and `acceptAuthAddress: true`
- Displays the signed-in state with the returned payload (message and signature)

## Development

```bash
pnpm install
pnpm dev
```

## Deployment

This app is designed to be deployed as a standalone Next.js application.

### Vercel Deployment

1. Set the **Root Directory** to: `examples/sign-in-test`
2. Framework Preset: Next.js
3. Build Command: `pnpm build` (or use default)
4. Output Directory: `.next` (default)

The app will be built and deployed independently from the rest of the monorepo.
