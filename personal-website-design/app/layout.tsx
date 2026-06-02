import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display, Fraunces, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans'
});
const _geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});
const _playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair'
});
const _fraunces = Fraunces({ 
  subsets: ["latin"],
  variable: '--font-fraunces',
  weight: ['400'],
  style: ['italic']
});
const _dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans'
});

export const metadata: Metadata = {
  title: 'Ramya Velchuri | Product Leader',
  description: 'Product leader with an MBA from Kellogg and a background in Computer Science, blending business, technology, and arts.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_geist.variable} ${_geistMono.variable} ${_playfair.variable} ${_fraunces.variable} ${_dmSans.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
