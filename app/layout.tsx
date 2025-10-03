import '@/app/globals.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { inter, orbitron } from '@/app/fonts'
import Providers from './providers'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: {
    default: 'AssetWave',
    template: `%s | AssetWave`,
  },
  description: '',
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable}`}
      suppressHydrationWarning={true}
    >
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="AssetWave" />
      
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
