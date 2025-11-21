'use client'

import { sdk } from '@farcaster/miniapp-sdk'
import { useEffect, useState } from 'react'

export type AuthUser = {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
  address?: string
  signature?: string
  message?: string
}

type Status = 'loading' | 'signedOut' | 'signedIn'

function generateNonce(length = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length]
  }
  return result
}

export function useAuthSession() {
  const [status, setStatus] = useState<Status>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isInMiniApp, setIsInMiniApp] = useState<boolean | null>(null)

  useEffect(() => {
    sdk.actions.ready()

    sdk.isInMiniApp().then((inMiniApp) => {
      setIsInMiniApp(inMiniApp)
      setStatus(inMiniApp ? 'signedOut' : 'signedOut')
    })
  }, [])

  const signIn = async () => {
    if (isInMiniApp === false) {
      setError(
        'Sign-in only works when this app is opened as a Farcaster Mini App.',
      )
      return
    }

    try {
      setStatus('loading')
      setError(null)

      const nonce = generateNonce(16)
      const result = await sdk.actions.signIn({
        nonce,
        acceptAuthAddress: true,
      })

      if (!result || !result.signature || !result.message) {
        throw new Error('Invalid sign-in response from host')
      }

      // Parse FID from message
      const fidMatch = result.message.match(/farcaster:\/\/fid\/(\d+)/)
      const fid = fidMatch?.[1]

      if (!fid) {
        throw new Error('Could not parse FID from sign-in message')
      }

      // Parse address
      let addressMatch = result.message.match(/account:\s*(0x[a-fA-F0-9]{40})/)
      if (!addressMatch) {
        addressMatch = result.message.match(/^(0x[a-fA-F0-9]{40})\s*$/m)
      }
      const address = addressMatch?.[1]

      setUser({
        fid: Number.parseInt(fid, 10),
        address,
        signature: result.signature,
        message: result.message,
      })
      setStatus('signedIn')
    } catch (err) {
      // biome-ignore lint/suspicious/noConsole: Debug logging for sign-in errors
      console.error('Sign-in error:', err)
      setError(err instanceof Error ? err.message : 'Sign-in failed')
      setStatus('signedOut')
    }
  }

  const signOut = () => {
    setUser(null)
    setStatus('signedOut')
    setError(null)
  }

  return {
    status,
    user,
    error,
    isInMiniApp: isInMiniApp ?? false,
    signIn,
    signOut,
  }
}
