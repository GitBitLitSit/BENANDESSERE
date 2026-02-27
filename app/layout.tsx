import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BEN&ESSERE by Larissa | Massage & Wellness',
  description: 'Ritrovare il benessere attraverso il potere del tocco. Prenota il tuo massaggio con Larissa.',
}

export const viewport: Viewport = {
  themeColor: '#c58b7a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
