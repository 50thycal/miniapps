import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { fetchUserAndCasts } from '../../../../lib/neynarClient.ts'

export async function GET(request: NextRequest) {
  try {
    // Get FID from query parameters
    const { searchParams } = new URL(request.url)
    const fidParam = searchParams.get('fid')

    if (!fidParam) {
      return NextResponse.json(
        { ok: false, error: 'Missing fid parameter' },
        { status: 400 },
      )
    }

    const fid = Number.parseInt(fidParam, 10)

    if (Number.isNaN(fid)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid fid parameter' },
        { status: 400 },
      )
    }

    // Fetch user data and casts from Neynar
    const data = await fetchUserAndCasts(fid)

    return NextResponse.json({ ok: true, data })
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Debug logging for Neynar errors
    console.error('Neynar API error:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    )
  }
}
