import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In Test - Farcaster Mini App',
  description: 'Example mini-app demonstrating sign-in functionality',
  other: {
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: 'https://miniapps-virid.vercel.app/embed-preview.png',
      button: {
        title: 'Playground',
        action: {
          type: 'launch_miniapp',
          name: 'Playground',
          url: 'https://miniapps-virid.vercel.app/',
        },
      },
    }),
  },
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
