'use client'

import { useEffect, useState } from 'react'

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

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useNeynarMe(fid?: number) {
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<NeynarMe | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!fid) return

    let cancelled = false
    setStatus('loading')
    setError(null)

    fetch(`/api/neynar/me?fid=${fid}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Request failed with ${res.status}`)
        }
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        if (!json.ok) {
          throw new Error(json.error || 'Unknown error')
        }
        setData(json.data)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        // biome-ignore lint/suspicious/noConsole: Debug logging for Neynar errors
        console.error('useNeynarMe error', err)
        setError(err.message ?? 'Failed to load Neynar data')
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [fid])

  return { status, data, error }
}
