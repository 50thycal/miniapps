'use client'

import type { AuthUser } from '../hooks/useAuthSession.ts'

type Props = {
  status: 'loading' | 'signedOut' | 'signedIn'
  user: AuthUser | null
  error: string | null
  isInMiniApp: boolean
  onSignIn: () => void
}

export function AuthCard({
  status,
  user,
  error,
  isInMiniApp,
  onSignIn,
}: Props) {
  if (!isInMiniApp) {
    return (
      <section
        style={{
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #fbbf24',
          backgroundColor: '#fef3c7',
          color: '#92400e',
        }}
      >
        <strong>ℹ️ Not in Mini-App:</strong> This app needs to be opened from
        within a Farcaster client to enable sign-in functionality.
      </section>
    )
  }

  if (status === 'signedIn' && user) {
    return (
      <section
        style={{
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          backgroundColor: 'white',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '12px',
          }}
        >
          Signed in as
        </h2>

        <div style={{ fontSize: '14px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 500 }}>FID:</span> {user.fid}
        </div>

        {user.address && (
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#6b7280' }}>
            <span style={{ fontWeight: 500 }}>Auth signer address:</span>
            <br />
            <span style={{ fontFamily: 'monospace' }}>
              {user.address.slice(0, 6)}…{user.address.slice(-4)}
            </span>
          </div>
        )}

        {user.message && (
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
              {user.message}
            </pre>
          </details>
        )}
      </section>
    )
  }

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <button
        type="button"
        onClick={onSignIn}
        disabled={status === 'loading'}
        style={{
          borderRadius: '9999px',
          backgroundColor: status === 'loading' ? '#9ca3af' : '#8b5cf6',
          color: 'white',
          padding: '12px 24px',
          fontWeight: 600,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: 'none',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (status !== 'loading') {
            e.currentTarget.style.backgroundColor = '#7c3aed'
          }
        }}
        onMouseLeave={(e) => {
          if (status !== 'loading') {
            e.currentTarget.style.backgroundColor = '#8b5cf6'
          }
        }}
      >
        {status === 'loading' ? 'Signing in...' : 'Sign in with Farcaster'}
      </button>

      {error && (
        <div
          style={{
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
    </section>
  )
}
