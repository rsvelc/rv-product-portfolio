import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display, Fraunces, DM_Sans, Cabin } from 'next/font/google'
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
const _cabin = Cabin({
  subsets: ["latin"],
  variable: '--font-cabin',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Ramya Velchuri | Product Leader',
  description: 'Product leader with an MBA from Kellogg and a background in Computer Science, blending business, technology, and arts.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_geist.variable} ${_geistMono.variable} ${_playfair.variable} ${_fraunces.variable} ${_dmSans.variable} ${_cabin.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
