'use client'

import { useNeynarMe } from '../hooks/useNeynarMe.ts'

type Props = {
  fid: number
}

export function NeynarProfileCard({ fid }: Props) {
  const { status, data, error } = useNeynarMe(fid)

  if (status === 'idle' || status === 'loading') {
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
          Farcaster Profile
        </h2>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Loading profile...
        </div>
      </section>
    )
  }

  if (status === 'error') {
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
          Farcaster Profile
        </h2>
        <div style={{ fontSize: '14px', color: '#dc2626' }}>
          <strong>Error:</strong> {error || 'Failed to load profile'}
        </div>
      </section>
    )
  }

  if (!data) {
    return null
  }

  // TODO(app): Extend this to use Neynar for more data (reactions, followers, channels, etc.).
  // See the Neynar SDK documentation for available endpoints: https://docs.neynar.com
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
          marginBottom: '16px',
        }}
      >
        Farcaster Profile
      </h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        {data.profile.pfpUrl && (
          // biome-ignore lint/a11y/useAltText: Profile picture decorative element
          // biome-ignore lint/performance/noImgElement: Using img for simplicity in template
          <img
            src={data.profile.pfpUrl}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        )}

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>
            {data.profile.displayName || data.profile.username}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            @{data.profile.username}
          </div>

          {(data.profile.followerCount !== undefined ||
            data.profile.followingCount !== undefined) && (
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '4px',
                display: 'flex',
                gap: '12px',
              }}
            >
              {data.profile.followerCount !== undefined && (
                <span>
                  <strong>{data.profile.followerCount}</strong> followers
                </span>
              )}
              {data.profile.followingCount !== undefined && (
                <span>
                  <strong>{data.profile.followingCount}</strong> following
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {data.profile.bio && (
        <div
          style={{
            fontSize: '14px',
            color: '#374151',
            marginBottom: '16px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {data.profile.bio}
        </div>
      )}

      {data.casts && data.casts.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 600,
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
                  fontSize: '13px',
                }}
              >
                <div style={{ marginBottom: '4px' }}>{cast.text}</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  {new Date(cast.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
