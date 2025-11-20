'use client'

import { sdk } from '@farcaster/miniapp-sdk'
import { useEffect, useState } from 'react'

type SignInResult = {
  signature: string
  message: string
  authMethod: 'custody' | 'authAddress'
}

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [signInData, setSignInData] = useState<SignInResult | null>(null)
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

      // Generate a random nonce
      const nonce = Math.random().toString(36).substring(2, 15)

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

      setSignInData(result)
      setIsSignedIn(true)
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

  if (isSignedIn && signInData) {
    return (
      <div>
        <h1>✅ Signed In</h1>
        <div style={{ marginTop: '20px' }}>
          <h2>Sign-In Details:</h2>
          <div
            style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '10px',
              wordBreak: 'break-all',
            }}
          >
            <div style={{ marginBottom: '15px' }}>
              <strong>Auth Method:</strong>
              <div style={{ marginTop: '5px' }}>{signInData.authMethod}</div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Message:</strong>
              <div
                style={{
                  marginTop: '5px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  backgroundColor: 'white',
                  padding: '10px',
                  borderRadius: '4px',
                }}
              >
                {signInData.message}
              </div>
            </div>
            <div>
              <strong>Signature:</strong>
              <div
                style={{
                  marginTop: '5px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  backgroundColor: 'white',
                  padding: '10px',
                  borderRadius: '4px',
                }}
              >
                {signInData.signature}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsSignedIn(false)
              setSignInData(null)
            }}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Sign In Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1>Sign In with Farcaster</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
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
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 600,
          backgroundColor:
            isLoading || isInMiniApp === null ? '#ccc' : '#8b5cf6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
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
          : isInMiniApp === null
            ? 'Checking environment...'
            : 'Sign in with Farcaster'}
      </button>

      {error && (
        <div
          style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            border: '1px solid #fca5a5',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}
