'use client'

import { useTestTransaction } from '../hooks/useTestTransaction.ts'

type Props = {
  className?: string
}

export function TestTransactionPanel({ className }: Props) {
  const { sendTestTx, status, txHash, error } = useTestTransaction()

  const isPending = status === 'pending'

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
      className={className}
    >
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '8px',
        }}
      >
        Onchain Test Action
      </h2>
      <p
        style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '12px',
        }}
      >
        This will send a 0-value transaction from your Farcaster wallet to
        yourself on Base. Nothing is transferred, but it will create onchain
        history.
      </p>

      <button
        type="button"
        onClick={sendTestTx}
        disabled={isPending}
        style={{
          borderRadius: '9999px',
          backgroundColor: isPending ? '#9ca3af' : '#2563eb',
          color: 'white',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 500,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: 'none',
          cursor: isPending ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isPending) {
            e.currentTarget.style.backgroundColor = '#1d4ed8'
          }
        }}
        onMouseLeave={(e) => {
          if (!isPending) {
            e.currentTarget.style.backgroundColor = '#2563eb'
          }
        }}
      >
        {isPending ? 'Sending…' : 'Send test transaction'}
      </button>

      {txHash && (
        <p
          style={{
            marginTop: '12px',
            fontSize: '12px',
            wordBreak: 'break-all',
            color: '#374151',
          }}
        >
          <span style={{ fontWeight: 600 }}>Tx hash:</span> {txHash}
        </p>
      )}

      {error && (
        <p
          style={{
            marginTop: '12px',
            fontSize: '12px',
            color: '#dc2626',
          }}
        >
          <span style={{ fontWeight: 600 }}>Error:</span> {error}
        </p>
      )}
    </section>
  )
}
