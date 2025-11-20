'use client'

import { useNeynarMe } from '../hooks/useNeynarMe.ts'

type Props = {
  fid: number
}

export function NeynarMePanel({ fid }: Props) {
  const { status, data, error } = useNeynarMe(fid)

  if (status === 'loading') {
    return (
      <section
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
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Loading Farcaster profile...
        </p>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section
        style={{
          marginTop: '24px',
          width: '100%',
          maxWidth: '28rem',
          borderRadius: '12px',
          border: '1px solid #fca5a5',
          backgroundColor: '#fee2e2',
          padding: '16px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <p style={{ fontSize: '14px', color: '#dc2626' }}>
          <strong>Error loading profile:</strong> {error}
        </p>
      </section>
    )
  }

  if (!data) return null

  return (
    <section
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
      {/* Profile Section */}
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
        Farcaster Profile
      </h2>

      <div style={{ marginBottom: '16px' }}>
        {data.profile.pfpUrl && (
          <img
            src={data.profile.pfpUrl}
            alt="Profile"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              marginBottom: '8px',
            }}
          />
        )}

        <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
          {data.profile.displayName || data.profile.username}
        </p>

        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
          @{data.profile.username}
        </p>

        {data.profile.bio && (
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            {data.profile.bio}
          </p>
        )}

        <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
          {data.profile.followerCount !== undefined && (
            <span>
              <strong>{data.profile.followerCount.toLocaleString()}</strong>{' '}
              followers
            </span>
          )}
          {data.profile.followingCount !== undefined && (
            <span>
              <strong>{data.profile.followingCount.toLocaleString()}</strong>{' '}
              following
            </span>
          )}
        </div>
      </div>

      {/* Recent Casts Section */}
      {data.casts && data.casts.length > 0 && (
        <>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 600,
              marginTop: '16px',
              marginBottom: '8px',
            }}
          >
            Recent Casts
          </h3>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {data.casts.slice(0, 5).map((cast) => (
              <div
                key={cast.hash}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                }}
              >
                <p style={{ fontSize: '14px', marginBottom: '6px' }}>
                  {cast.text}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  {new Date(cast.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
