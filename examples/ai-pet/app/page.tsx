'use client'

import { AuthCard } from '../components/AuthCard.tsx'
import { ChatCard } from '../components/ChatCard.tsx'
import { useAuthSession } from '../hooks/useAuthSession.ts'
import { APP_CONFIG } from './config.ts'

export default function Home() {
  const { status, user, error, isInMiniApp, signIn } = useAuthSession()

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
            {APP_CONFIG.title}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {APP_CONFIG.description}
          </p>
        </div>

        <AuthCard
          status={status}
          user={user}
          error={error}
          isInMiniApp={isInMiniApp}
          onSignIn={signIn}
        />

        {fid && isInMiniApp && <ChatCard fid={fid} />}

        {!fid && status === 'signedOut' && isInMiniApp && (
          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              textAlign: 'center',
            }}
          >
            Sign in with Farcaster to chat with your AI Pet
          </p>
        )}
      </div>
    </main>
  )
}
