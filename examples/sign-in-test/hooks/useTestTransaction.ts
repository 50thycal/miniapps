'use client'

import { sdk } from '@farcaster/miniapp-sdk'
import { useCallback, useState } from 'react'

type TxStatus = 'idle' | 'pending' | 'success' | 'error'

export function useTestTransaction() {
  const [status, setStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sendTestTx = useCallback(async () => {
    setError(null)
    setTxHash(null)
    setStatus('pending')

    try {
      // Get Farcaster Wallet provider (EIP-1193)
      const provider = await sdk.wallet.getEthereumProvider()

      if (!provider) {
        throw new Error('Wallet provider not available.')
      }

      // Get user's address
      const accounts = (await provider.request({
        method: 'eth_requestAccounts',
      })) as string[] | undefined
      const from = accounts?.[0] as `0x${string}` | undefined

      if (!from) {
        throw new Error('No wallet connected.')
      }

      // 0-value transaction from user → themselves
      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: from,
            value: '0x0', // no ETH transfer, only gas
          },
        ],
      })

      setTxHash(String(hash))
      setStatus('success')
    } catch (err: unknown) {
      // biome-ignore lint/suspicious/noConsole: Debug logging for transaction errors
      console.error('Test tx error', err)
      const errorMessage =
        err instanceof Error ? err.message : 'Transaction failed'
      setError(errorMessage)
      setStatus('error')
    }
  }, [])

  return {
    sendTestTx,
    status,
    txHash,
    error,
  }
}
