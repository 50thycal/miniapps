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

  useEffect(() => {
    // Call ready() after mounting so it renders correctly as a mini-app
    sdk.actions.ready()
  }, [])

  const handleSignIn = async () => {
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

      setSignInData(result)
      setIsSignedIn(true)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
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

      <button
        type="button"
        onClick={handleSignIn}
        disabled={isLoading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 600,
          backgroundColor: isLoading ? '#ccc' : '#8b5cf6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#7c3aed'
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#8b5cf6'
          }
        }}
      >
        {isLoading ? 'Signing in...' : 'Sign in with Farcaster'}
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
