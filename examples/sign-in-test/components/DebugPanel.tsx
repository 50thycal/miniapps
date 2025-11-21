'use client'

import { useDebugInfo } from '../hooks/useDebugInfo.ts'

type Props = {
  fid: number
  appVersion: string
  isMiniApp?: boolean
}

export function DebugPanel({ fid, appVersion, isMiniApp }: Props) {
  const { status, data, error } = useDebugInfo(true)

  return (
    <section
      style={{
        marginTop: '24px',
        width: '100%',
        maxWidth: '28rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        padding: '16px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
        Debug Info
      </h2>

      <div style={{ fontSize: '14px', marginBottom: '8px' }}>
        <strong>FID:</strong> {fid}
      </div>

      <div style={{ fontSize: '14px', marginBottom: '8px' }}>
        <strong>App version:</strong> {appVersion}
      </div>

      <div style={{ fontSize: '14px', marginBottom: '8px' }}>
        <strong>Is Mini App:</strong>{' '}
        {typeof isMiniApp === 'boolean'
          ? isMiniApp
            ? 'yes'
            : 'no'
          : 'unknown'}
      </div>

      {status === 'loading' && (
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Loading additional environment info…
        </div>
      )}

      {status === 'error' && (
        <div style={{ fontSize: '14px', color: '#dc2626' }}>
          <strong>Error loading additional data:</strong> {error}
        </div>
      )}

      {status === 'success' && data && (
        <div
          style={{
            fontSize: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {data.chains && data.chains.length > 0 && (
            <div>
              <strong>Chains:</strong>
              <ul style={{ marginLeft: '20px', marginTop: '4px' }}>
                {data.chains.map((c) => (
                  <li key={c.id}>
                    {c.name ?? 'Unknown'} ({c.id})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.capabilities && data.capabilities.length > 0 && (
            <div>
              <strong>Capabilities:</strong>
              <ul style={{ marginLeft: '20px', marginTop: '4px' }}>
                {data.capabilities.map((cap) => (
                  <li key={cap}>{cap}</li>
                ))}
              </ul>
            </div>
          )}

          {!data.chains && !data.capabilities && (
            <div style={{ color: '#6b7280', fontSize: '12px' }}>
              No additional environment data available
            </div>
          )}
        </div>
      )}
    </section>
  )
}
