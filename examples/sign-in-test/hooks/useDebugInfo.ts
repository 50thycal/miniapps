'use client'

import { sdk } from '@farcaster/miniapp-sdk'
import { useEffect, useState } from 'react'

export type DebugInfo = {
  isMiniApp: boolean
  chains: Array<{ id: string; name?: string }> | null
  capabilities: string[] | null
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useDebugInfo(enabled: boolean) {
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<DebugInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    async function load() {
      try {
        setStatus('loading')

        // Check if we're in a Mini App
        const isMiniApp = await sdk.isInMiniApp()

        let chains: DebugInfo['chains'] = null
        let capabilities: DebugInfo['capabilities'] = null

        try {
          // Get supported chains from the wallet
          const walletChains: any = await sdk.getChains()
          if (walletChains) {
            chains = walletChains.map((c: any) => {
              // Handle both string chain IDs and chain objects
              if (typeof c === 'string' || typeof c === 'number') {
                return { id: String(c), name: undefined }
              }
              return {
                id: String(c.id ?? c.chainId ?? ''),
                name: c.name,
              }
            })
          }
        } catch (e) {
          // Chains not available, leave as null
          // biome-ignore lint/suspicious/noConsole: Debug logging for chain fetch errors
          console.warn('Could not fetch chains:', e)
        }

        try {
          // Get Mini App host capabilities
          const caps = await sdk.getCapabilities()
          if (caps && Array.isArray(caps)) {
            capabilities = caps
          }
        } catch (e) {
          // Capabilities not available, leave as null
          // biome-ignore lint/suspicious/noConsole: Debug logging for capabilities fetch errors
          console.warn('Could not fetch capabilities:', e)
        }

        if (!cancelled) {
          setData({ isMiniApp, chains, capabilities })
          setStatus('success')
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load debug info',
          )
          setStatus('error')
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [enabled])

  return { status, data, error }
}
