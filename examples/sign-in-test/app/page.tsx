'use client'

import { sdk } from '@farcaster/miniapp-sdk'
import { useEffect, useState } from 'react'

type SignInResult = {
  signature: string
  message: string
  authMethod: 'custody' | 'authAddress'
}

type ParsedUser = {
  fid?: string
  address?: string
}

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

export default function Home() {
  const [parsedUser, setParsedUser] = useState<ParsedUser | null>(null)
  const [signInResult, setSignInResult] = useState<SignInResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInMiniApp, setIsInMiniApp] = useState<boolean | null>(null)

  useEffect(() => {
    // Call ready() after mounting so it renders correctly as a mini-app
    sdk.actions.ready()

    // Detect if we're running inside a Farcaster mini-app
    sdk.isInMiniApp().then((inMiniApp) => {
      setIsInMiniApp(inMiniApp)
      console.log('Running in Farcaster mini-app:', inMiniApp)
    })
  }, [])

  const handleSignIn = async () => {
    // Check if we're in a mini-app before attempting sign-in
    if (isInMiniApp === false) {
      setError(
        'Sign-in only works when this app is opened as a Farcaster Mini App. Open it from within a Farcaster client to test authentication.',
      )
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Generate a random alphanumeric nonce (required by SIWF validation)
      // Must be at least 8 characters and contain only [a-zA-Z0-9]
      const nonce = generateNonce(16)

      // Call signIn with the required parameters
      const result = await sdk.actions.signIn({
        nonce,
        acceptAuthAddress: true,
      })

      // Validate the response
      if (!result) {
        // biome-ignore lint/suspicious/noConsole: Debug logging for sign-in errors
        console.error('Sign-in failed: no response from host')
        setError('Sign-in failed: no response from host')
        return
      }

      if (!result.signature || !result.message) {
        // biome-ignore lint/suspicious/noConsole: Debug logging for sign-in errors
        console.error('Sign-in failed: invalid response shape', result)
        setError('Sign-in failed: invalid response from host')
        return
      }

      // Parse FID from "farcaster://fid/12345"
      const fidMatch = result.message.match(/farcaster:\/\/fid\/(\d+)/)
      const fid = fidMatch?.[1]

      // Parse Ethereum address - it appears after "account:" or on second line
      // Try "account: 0x..." format first
      let addressMatch = result.message.match(/account:\s*(0x[a-fA-F0-9]{40})/)
      if (!addressMatch) {
        // Fallback: look for any 0x... address (typically on line 2)
        addressMatch = result.message.match(/^(0x[a-fA-F0-9]{40})\s*$/m)
      }
      const address = addressMatch?.[1]

      setSignInResult(result)
      setParsedUser({ fid, address })
    } catch (err) {
      // biome-ignore lint/suspicious/noConsole: Debug logging for sign-in errors
      console.error('Sign-in error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred during sign-in')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      <h1
        style={{
          fontSize: '30px',
          fontWeight: 'bold',
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        Sign In with Farcaster
      </h1>
      <p
        style={{
          color: '#6b7280',
          marginBottom: '24px',
          textAlign: 'center',
          maxWidth: '28rem',
        }}
      >
        Click the button below to sign in with your Farcaster account.
      </p>

      {isInMiniApp === false && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: '#fef3c7',
            color: '#92400e',
            borderRadius: '8px',
            border: '1px solid #fbbf24',
            maxWidth: '28rem',
          }}
        >
          <strong>ℹ️ Not in Mini-App:</strong> This app needs to be opened from
          within a Farcaster client to enable sign-in functionality.
        </div>
      )}

      <button
        type="button"
        onClick={handleSignIn}
        disabled={isLoading || isInMiniApp === null}
        style={{
          borderRadius: '9999px',
          backgroundColor:
            isLoading || isInMiniApp === null ? '#9ca3af' : '#8b5cf6',
          color: 'white',
          padding: '12px 24px',
          fontWeight: 600,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: 'none',
          cursor: isLoading || isInMiniApp === null ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isLoading && isInMiniApp !== null) {
            e.currentTarget.style.backgroundColor = '#7c3aed'
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading && isInMiniApp !== null) {
            e.currentTarget.style.backgroundColor = '#8b5cf6'
          }
        }}
      >
        {isLoading
          ? 'Signing in...'
          : parsedUser
            ? 'Signed in – Sign in again'
            : isInMiniApp === null
              ? 'Checking environment...'
              : 'Sign in with Farcaster'}
      </button>

      {error && (
        <div
          style={{
            marginTop: '16px',
            borderRadius: '6px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '16px',
            fontSize: '14px',
            maxWidth: '28rem',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {parsedUser && (
        <div
          style={{
            marginTop: '24px',
            width: '100%',
            maxWidth: '28rem',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            padding: '16px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Signed in as
          </h2>
          {parsedUser.fid && (
            <p style={{ fontSize: '14px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 500 }}>FID:</span> {parsedUser.fid}
            </p>
          )}
          {parsedUser.address && (
            <p style={{ fontSize: '14px', marginTop: '4px' }}>
              <span style={{ fontWeight: 500 }}>Wallet:</span>{' '}
              <span style={{ fontFamily: 'monospace' }}>
                {parsedUser.address.slice(0, 6)}…{parsedUser.address.slice(-4)}
              </span>
            </p>
          )}

          {signInResult && (
            <details
              style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}
            >
              <summary style={{ cursor: 'pointer' }}>
                View raw sign-in message
              </summary>
              <pre
                style={{
                  marginTop: '8px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '11px',
                }}
              >
                {signInResult.message}
              </pre>
            </details>
          )}
        </div>
      )}
    </main>
  )
}
