'use client'

import { useState } from 'react'
import { useMiniAppWallet } from '../hooks/useMiniAppWallet.ts'

type Props = {
  fid: number
}

export function WalletCard({ fid }: Props) {
  const {
    address,
    chainId,
    loading,
    error,
    isInMiniApp,
    sendTestTx,
    isSendingTx,
  } = useMiniAppWallet(!!fid)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)

  if (!isInMiniApp) {
    return null
  }

  const handleSendTestTx = async () => {
    setTxHash(null)
    setTxError(null)

    try {
      const hash = await sendTestTx()
      setTxHash(hash)
    } catch (err) {
      setTxError(err instanceof Error ? err.message : 'Transaction failed')
    }
  }

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
        Mini App Wallet
      </h2>

      {loading && (
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Loading wallet...
        </div>
      )}

      {error && (
        <div style={{ fontSize: '14px', color: '#dc2626' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {address && (
        <>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 500 }}>Address:</span>
            <br />
            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
          </div>

          {chainId && (
            <div style={{ fontSize: '14px', marginBottom: '12px' }}>
              <span style={{ fontWeight: 500 }}>Chain ID:</span> {chainId}
            </div>
          )}

          {/* TODO(app): Replace this test transaction with your own game/action transaction logic. */}
          {/* See useMiniAppWallet.ts for how to send custom transactions with the mini app wallet. */}
          <button
            type="button"
            onClick={handleSendTestTx}
            disabled={isSendingTx}
            style={{
              borderRadius: '8px',
              backgroundColor: isSendingTx ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              cursor: isSendingTx ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isSendingTx) {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSendingTx) {
                e.currentTarget.style.backgroundColor = '#3b82f6'
              }
            }}
          >
            {isSendingTx ? 'Sending...' : 'Send Test Transaction'}
          </button>

          {txHash && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#d1fae5',
                color: '#065f46',
                fontSize: '12px',
              }}
            >
              <strong>✓ Transaction sent!</strong>
              <br />
              <span style={{ fontFamily: 'monospace' }}>
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </span>
            </div>
          )}

          {txError && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                fontSize: '12px',
              }}
            >
              <strong>Error:</strong> {txError}
            </div>
          )}
        </>
      )}
    </section>
  )
}
