import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In Test - Farcaster Mini App',
  description: 'Example mini-app demonstrating sign-in functionality',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: '20px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  )
}
