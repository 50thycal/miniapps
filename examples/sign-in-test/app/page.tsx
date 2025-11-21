'use client'

import { AuthCard } from '../components/AuthCard.tsx'
import { NeynarProfileCard } from '../components/NeynarProfileCard.tsx'
import { WalletCard } from '../components/WalletCard.tsx'
import { useAuthSession } from '../hooks/useAuthSession.ts'

export default function Home() {
  const { status, user } = useAuthSession()

  const fid = user?.fid

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        gap: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '28rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '30px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            Farcaster Mini App Starter
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            A complete template with auth, wallet, and profile integration
          </p>
        </div>

        <AuthCard />

        {fid && (
          <>
            <WalletCard fid={fid} />
            <NeynarProfileCard fid={fid} />
          </>
        )}

        {!fid && status === 'signedOut' && (
          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              textAlign: 'center',
            }}
          >
            Sign in with Farcaster to see wallet and profile info
          </p>
        )}
      </div>
    </main>
  )
}
