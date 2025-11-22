# AI Pet — Farcaster Mini App

Your personal AI companion on Farcaster. Chat privately with your AI Pet, and in future updates, create a public Farcaster profile for autonomous posting.

## Current Features (PR #1)

- **Farcaster Sign-In** - QuickAuth authentication using `@farcaster/miniapp-sdk`
- **Private Chat** - Chat with your AI companion powered by OpenAI's `gpt-4o-mini`
- **Streaming Responses** - Real-time message streaming for a smooth chat experience

## Coming Soon

- **Public AI Profiles** - Create a dedicated Farcaster FID for your AI
- **Personality Customization** - Configure tone, topics, and behavior
- **Autonomous Posting** - Your AI can post on its own Farcaster feed
- **Activity Log** - View your AI's recent casts and interactions

## Tech Stack

- **Next.js 15** - App Router with React Server Components
- **TypeScript** - Full type safety
- **@farcaster/miniapp-sdk** - Official Farcaster Mini App SDK for auth
- **OpenAI API** - `gpt-4o-mini` for chat completions with streaming
- **React 19** - Latest React features

## Required Environment Variables

Create a `.env.local` file in this directory:

```bash
# Required for chat functionality
OPENAI_API_KEY=your_openai_api_key_here

# Will be used in future PRs
NEYNAR_API_KEY=your_neynar_api_key_here
DATABASE_URL=your_database_url_here
```

Get your OpenAI API key from [platform.openai.com](https://platform.openai.com).
Get your Neynar API key from [neynar.com](https://neynar.com).

## Running on Vercel

When deploying the ai-pet example from this monorepo:

### Vercel Project Settings

- **Root Directory**: `examples/ai-pet`
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
  cd ../.. && pnpm --filter ai-pet build
  ```
- **Output Directory**: `.next`

### Environment Variables

Add these in the Vercel dashboard under Settings → Environment Variables:
- `OPENAI_API_KEY` (required now)
- `NEYNAR_API_KEY` (for future PRs)
- `DATABASE_URL` (for future PRs)

## Local Development

From the repository root:

```bash
# Install dependencies
pnpm install

# Create .env.local in examples/ai-pet/
echo "OPENAI_API_KEY=your_key_here" > examples/ai-pet/.env.local

# Run dev server
pnpm --filter ai-pet dev

# Build for production
pnpm --filter ai-pet build
```

**Note**: The mini app must be opened from within a Farcaster client (Warpcast). It won't fully work in a regular browser.

## Architecture Overview

```
examples/ai-pet/
├── app/
│   ├── api/
│   │   ├── chat/route.ts           # OpenAI chat endpoint with streaming
│   │   └── neynar/me/route.ts      # Neynar API endpoint (from template)
│   ├── config.ts                    # App title, description, version
│   ├── layout.tsx                   # Root layout with metadata
│   └── page.tsx                     # Main app page
├── components/
│   ├── AuthCard.tsx                 # Sign-in and auth state display
│   ├── ChatCard.tsx                 # Chat UI with streaming support
│   ├── WalletCard.tsx               # (from template, not currently used)
│   └── NeynarProfileCard.tsx        # (from template, not currently used)
├── hooks/
│   ├── useAuthSession.ts            # SIWF authentication state
│   ├── useMiniAppWallet.ts          # Mini App wallet provider
│   └── useNeynarMe.ts               # Neynar profile data fetching
├── lib/
│   └── neynarClient.ts              # Neynar API client (server-side)
└── package.json
```

## Development Roadmap

This app is being built incrementally following the Build Whenever workflow:

- ✅ **PR #1**: Base chat UI with OpenAI streaming (current)
- 🔜 **PR #2**: Database schema with Drizzle ORM
- 🔜 **PR #3**: AI profile creation via Neynar
- 🔜 **PR #4**: Personality & settings configuration
- 🔜 **PR #5**: Autonomous posting engine
- 🔜 **PR #6**: Polish & safety guardrails

## Common Issues

### "Not in Mini-App" Warning

This app detects the Mini App environment using the SDK. If you see this warning, you're not opening it from a Farcaster client. Test in Warpcast using the Farcaster dev playground.

### OpenAI API Errors

Ensure `OPENAI_API_KEY` is set in both `.env.local` (for local dev) and your Vercel environment variables.

### Chat Not Streaming

If messages appear all at once instead of streaming:
- Check that the `/api/chat` endpoint is returning `text/event-stream`
- Ensure you're using a modern browser that supports Server-Sent Events (SSE)
- Check browser console for any fetch errors

## Learn More

- [Farcaster Mini Apps Documentation](https://docs.farcaster.xyz/developers/guides/mini-apps)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [AI Pet Specification](../../docs/ai_pet/spec.md)
- [Development Plan](../../docs/ai_pet/plan.md)

## License

This app is part of the Farcaster Mini Apps repository and follows the same license.
