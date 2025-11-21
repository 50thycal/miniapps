# Farcaster Mini App Starter

A clean, reusable template for building Farcaster Mini Apps. This starter is production-ready and designed to be duplicated for new projects.

## What This Starter Does

After opening in a Farcaster client (like Warpcast), this mini app provides:

- **Farcaster Sign-In** - QuickAuth authentication using `@farcaster/miniapp-sdk`
- **User Info Display** - Shows FID, username, display name, and profile picture
- **Native Mini App Wallet** - Displays the Warpcast wallet address (auth signer)
- **Test Transaction** - Sends a simple transaction on Base using the native wallet
- **Farcaster Profile** - Fetches and displays profile data and recent casts via Neynar API

This is a starting point. The `TODO(app)` comments throughout the code mark where you'll add your own app logic.

## Tech Stack

- **Next.js 15** - App Router with React Server Components
- **TypeScript** - Full type safety
- **@farcaster/miniapp-sdk** - Official Farcaster Mini App SDK for auth and wallet
- **@neynar/nodejs-sdk** - Neynar API client for Farcaster data
- **React 19** - Latest React features

## Required Environment Variables

Set these in your deployment platform (Vercel, etc.) and in `.env.local` for local development:

```bash
NEYNAR_API_KEY=your_neynar_api_key_here
```

Get your Neynar API key from [neynar.com](https://neynar.com).

## Running This Example on Vercel

When deploying the sign-in-test example from this monorepo:

### Vercel Project Settings

- **Root Directory**: `examples/sign-in-test`
- **Framework Preset**: Next.js
- **Node Version**: 18.x or later

### Build & Install Commands

Because this is a monorepo using pnpm, configure:

- **Install Command**:
  ```bash
  cd ../.. && pnpm install
  ```
- **Build Command**:
  ```bash
  cd ../.. && pnpm --filter sign-in-test build
  ```
- **Output Directory**: `.next`

### Environment Variables

Add `NEYNAR_API_KEY` in the Vercel dashboard under Settings → Environment Variables.

## How to Create a New Mini App from This Starter

This is the workflow for duplicating this template to start a new project:

### 1. Duplicate the Folder

From the repository root:

```bash
cp -r examples/sign-in-test examples/my-new-app
```

Replace `my-new-app` with your project name (lowercase, hyphens instead of spaces).

### 2. Update App Configuration

Edit `examples/my-new-app/app/config.ts`:

```typescript
export const APP_CONFIG = {
  title: "My New Mini App",
  description: "Description of what my app does",
  appVersion: "0.1.0",
}
```

This updates the title, description, and version shown in your app's UI and metadata.

### 3. Create a New Vercel Project

1. Go to [vercel.com](https://vercel.com) and create a new project
2. Point it to your fork of this monorepo
3. Configure the project:
   - **Root Directory**: `examples/my-new-app`
   - **Framework Preset**: Next.js
   - **Install Command**: `cd ../.. && pnpm install`
   - **Build Command**: `cd ../.. && pnpm --filter my-new-app build`
   - **Output Directory**: `.next`
4. Add environment variables:
   - `NEYNAR_API_KEY` (required for profile data)
5. Deploy

You'll get a URL like `https://my-new-app.vercel.app`.

### 4. Register Your Mini App with Farcaster

1. Go to the [Farcaster Developer Portal](https://warpcast.com/~/developers)
2. Create a new Mini App
3. Set the **Mini App URL** to your Vercel deployment: `https://my-new-app.vercel.app`
4. Configure permissions:
   - ✅ Request user profile
   - ✅ Request wallet access
5. Add your domain and create a domain manifest at `/.well-known/farcaster.json` (if required)
6. Use **"Preview Mini App URL"** in Farcaster dev tools to test your app on mobile

### 5. Customize the Starter

Now you're ready to build your app. Look for `TODO(app)` comments in the code:

- **`app/page.tsx`** - Main UI after sign-in (lines 60-64)
- **`components/WalletCard.tsx`** - Test transaction button (lines 87-88) - replace with your game/action logic
- **`components/NeynarProfileCard.tsx`** - Extend Neynar integration (lines 70-71) for reactions, followers, etc.

Start by editing these sections to add your app's unique functionality.

## Architecture Overview

```
examples/sign-in-test/
├── app/
│   ├── api/
│   │   └── neynar/me/route.ts    # Server-side Neynar API endpoint
│   ├── config.ts                  # App title, description, version
│   ├── layout.tsx                 # Root layout with metadata
│   └── page.tsx                   # Main app page (thin orchestration)
├── components/
│   ├── AuthCard.tsx               # Sign-in and auth state display
│   ├── WalletCard.tsx             # Wallet address and test transaction
│   └── NeynarProfileCard.tsx      # Farcaster profile and casts
├── hooks/
│   ├── useAuthSession.ts          # SIWF authentication state
│   ├── useMiniAppWallet.ts        # Mini App wallet provider
│   └── useNeynarMe.ts             # Neynar profile data fetching
├── lib/
│   └── neynarClient.ts            # Neynar API client (server-side)
└── package.json
```

The architecture keeps `page.tsx` thin—it just orchestrates the hooks and renders components. Business logic lives in `hooks/`, UI in `components/`, and server-side API calls in `app/api/`.

## Local Development

From the repository root:

```bash
# Install dependencies
pnpm install

# Create .env.local in examples/sign-in-test/
echo "NEYNAR_API_KEY=your_key_here" > examples/sign-in-test/.env.local

# Run dev server
pnpm --filter sign-in-test dev

# Build for production
pnpm --filter sign-in-test build
```

**Note**: The mini app must be opened from within a Farcaster client (Warpcast). It won't fully work in a regular browser.

## Common Issues

### "Not in Mini-App" Warning

This app detects the Mini App environment using the SDK. If you see this warning, you're not opening it from a Farcaster client. Test in Warpcast using the Farcaster dev playground.

### Neynar API Errors

Ensure `NEYNAR_API_KEY` is set in both `.env.local` (for local dev) and your Vercel environment variables.

### Transaction Failures

- Make sure you're testing in a Farcaster client that supports Mini App wallets
- Ensure the wallet is on the correct network (Base, chain ID 8453)
- Check that the user has granted wallet permissions to your mini app

## Learn More

- [Farcaster Mini Apps Documentation](https://docs.farcaster.xyz/developers/guides/mini-apps)
- [Neynar API Documentation](https://docs.neynar.com)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)

## License

This template is part of the Farcaster Mini Apps repository and follows the same license.
