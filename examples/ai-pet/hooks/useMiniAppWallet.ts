'use client'

import { sdk } from '@farcaster/miniapp-sdk'
import { useEffect, useState } from 'react'

export function useMiniAppWallet(enabled: boolean) {
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInMiniApp, setIsInMiniApp] = useState(false)
  const [isSendingTx, setIsSendingTx] = useState(false)

  useEffect(() => {
    sdk.isInMiniApp().then(setIsInMiniApp)
  }, [])

  useEffect(() => {
    if (!enabled || !isInMiniApp) return

    let cancelled = false
    setLoading(true)

    async function loadWallet() {
      try {
        const provider = await sdk.wallet.getEthereumProvider()

        if (!provider) {
          setError('Wallet provider not available')
          return
        }

        const accounts = (await provider.request({
          method: 'eth_accounts',
        })) as string[]

        const chain = (await provider.request({
          method: 'eth_chainId',
        })) as string

        if (!cancelled) {
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0])
            setChainId(Number.parseInt(chain, 16))
            setError(null)
          } else {
            setError('No wallet accounts available')
          }
        }
      } catch (err) {
        if (!cancelled) {
          // biome-ignore lint/suspicious/noConsole: Debug logging for wallet errors
          console.error('Error loading wallet', err)
          setError('Unable to load Mini App wallet')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadWallet()

    return () => {
      cancelled = true
    }
  }, [enabled, isInMiniApp])

  const sendTestTx = async () => {
    if (!address || !isInMiniApp) {
      throw new Error('Wallet not available')
    }

    setIsSendingTx(true)
    setError(null)

    try {
      const provider = await sdk.wallet.getEthereumProvider()
      if (!provider) {
        throw new Error('Wallet provider not available')
      }

      const txHash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: address as `0x${string}`,
            to: address as `0x${string}`,
            value: '0x0',
            data: '0x',
          },
        ],
      })) as string

      return txHash
    } catch (err) {
      // biome-ignore lint/suspicious/noConsole: Debug logging for transaction errors
      console.error('Transaction error:', err)
      const errorMessage =
        err instanceof Error ? err.message : 'Transaction failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsSendingTx(false)
    }
  }

  return {
    address,
    chainId,
    loading,
    error,
    isInMiniApp,
    sendTestTx,
    isSendingTx,
  }
}
