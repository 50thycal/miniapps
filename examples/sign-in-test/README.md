# Farcaster Mini App Starter

A complete, production-ready template for building Farcaster Mini Apps with authentication, wallet integration, and profile data.

## What's Included

This starter template provides:

- ✅ **Sign In with Farcaster (SIWF)** - QuickAuth integration for seamless authentication
- ✅ **Mini App Wallet** - Access to the Warpcast wallet (Mini App wallet provider)
- ✅ **Test Transactions** - Send transactions using the Mini App wallet on Base
- ✅ **Neynar Integration** - Fetch and display Farcaster profile data and recent casts
- ✅ **Clean Architecture** - Organized hooks, components, and utilities
- ✅ **TypeScript** - Fully typed for better developer experience

## Architecture

```
examples/sign-in-test/
├── app/
│   ├── api/
│   │   └── neynar/me/route.ts    # Server-side Neynar API endpoint
│   ├── layout.tsx                 # Root layout
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

## Getting Started

### Prerequisites

1. **Neynar API Key** - Get one from [neynar.com](https://neynar.com)
2. **Vercel Account** - For deployment
3. **Farcaster Client** - Warpcast or another client that supports Mini Apps

### Environment Variables

Set the following environment variable in your deployment:

```bash
NEYNAR_API_KEY=your_neynar_api_key_here
```

**For local development**, create `.env.local`:

```bash
NEYNAR_API_KEY=your_neynar_api_key_here
```

### Local Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Creating a New Mini App from This Template

### 1. Copy the Template

```bash
# From the repository root
cp -r examples/sign-in-test examples/my-new-app
```

### 2. Update App Metadata

Edit `examples/my-new-app/app/page.tsx`:

```tsx
<h1>Your App Name Here</h1>
<p>Your app description</p>
```

Update `examples/my-new-app/app/layout.tsx`:

```tsx
export const metadata = {
  title: 'Your App Name',
  description: 'Your app description',
}
```

### 3. Deploy to Vercel

1. Create a new Vercel project
2. Point it to your fork of this repository
3. Set the **Root Directory** to `examples/my-new-app`
4. Add environment variable: `NEYNAR_API_KEY`
5. Deploy

### 4. Register Your Mini App

1. Go to the [Farcaster Developer Portal](https://warpcast.com/~/developers)
2. Create a new Mini App
3. Set the URL to your Vercel deployment: `https://your-app.vercel.app`
4. Configure permissions:
   - ✅ Request user profile
   - ✅ Request wallet access
5. Save and test in Warpcast

## Key Features

### Authentication

The `useAuthSession` hook handles Sign In with Farcaster:

```tsx
const { status, user, signIn, signOut } = useAuthSession()

// user contains: fid, address, signature, message
```

### Wallet Integration

The `useMiniAppWallet` hook provides wallet access:

```tsx
const { address, chainId, sendTestTx } = useMiniAppWallet(enabled)

// Send a test transaction
await sendTestTx()
```

### Neynar Profile Data

The `useNeynarMe` hook fetches profile and casts:

```tsx
const { status, data } = useNeynarMe(fid)

// data contains: profile (username, displayName, bio, pfp, followers)
//                casts (recent activity)
```

## Customization

### Adding New Features

1. **Add a new hook** in `hooks/` for business logic
2. **Create a component** in `components/` for UI
3. **Wire it up** in `app/page.tsx`

### Styling

This template uses inline styles for simplicity. You can:

- Replace with Tailwind CSS
- Use CSS modules
- Add a design system

### API Routes

Add new API routes in `app/api/`:

```tsx
// app/api/my-endpoint/route.ts
export async function GET(request: NextRequest) {
  // Your server-side logic
  return NextResponse.json({ data: 'hello' })
}
```

## Tech Stack

- **Next.js 15** - App Router with React Server Components
- **@farcaster/miniapp-sdk** - Official Farcaster Mini App SDK
- **@neynar/nodejs-sdk** - Neynar API client
- **TypeScript** - Type safety
- **React 19** - Latest React features

## Common Issues

### "Not in Mini-App" Warning

This app must be opened from within a Farcaster client (like Warpcast). It won't work in a regular browser.

### Neynar API Errors

Make sure `NEYNAR_API_KEY` is set in your environment variables (both locally and in Vercel).

### Transaction Failures

Ensure you're testing in a Farcaster client that supports Mini App wallets. The wallet must be on the correct network (Base).

## Learn More

- [Farcaster Mini Apps Documentation](https://docs.farcaster.xyz/developers/guides/mini-apps)
- [Neynar API Documentation](https://docs.neynar.com)
- [Next.js Documentation](https://nextjs.org/docs)

## License

This template is part of the Farcaster Mini Apps repository and follows the same license.
