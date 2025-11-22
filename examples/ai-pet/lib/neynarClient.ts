import { NeynarAPIClient } from '@neynar/nodejs-sdk'

export type NeynarMe = {
  fid: number
  profile: {
    username: string
    displayName?: string
    bio?: string
    pfpUrl?: string
    followerCount?: number
    followingCount?: number
  }
  casts: Array<{
    hash: string
    text: string
    timestamp: string
  }>
}

let client: NeynarAPIClient | null = null

export function getNeynarClient(): NeynarAPIClient {
  const apiKey = process.env.NEYNAR_API_KEY

  if (!apiKey) {
    throw new Error(
      'NEYNAR_API_KEY is not set. Please add it to your .env.local or Vercel environment variables.',
    )
  }

  if (!client) {
    client = new NeynarAPIClient({ apiKey })
  }

  return client
}

export async function fetchUserAndCasts(fid: number): Promise<NeynarMe> {
  const client = getNeynarClient()

  // Fetch user by FID
  const userResponse = await client.fetchBulkUsers({ fids: [fid] })
  const user = userResponse.users[0]

  if (!user) {
    throw new Error(`User with FID ${fid} not found`)
  }

  // Fetch recent casts for this user
  const castsResponse = await client.fetchCastsForUser({ fid, limit: 10 })

  return {
    fid: user.fid,
    profile: {
      username: user.username,
      displayName: user.display_name || undefined,
      bio: user.profile?.bio?.text || undefined,
      pfpUrl: user.pfp_url || undefined,
      followerCount: user.follower_count || undefined,
      followingCount: user.following_count || undefined,
    },
    casts: castsResponse.casts.map((cast) => ({
      hash: cast.hash,
      text: cast.text,
      timestamp: cast.timestamp,
    })),
  }
}
