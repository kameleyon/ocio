import './globals.css'
import './animations.css'
import type { Metadata } from 'next'
import { Comfortaa, Questrial } from 'next/font/google'
import { ParticleBackground } from '@/components/ui/particle-background'
import { AuthProvider } from '@/contexts/auth-context'

const comfortaa = Comfortaa({ 
  subsets: ['latin'],
  variable: '--font-comfortaa',
  display: 'swap',
})

const questrial = Questrial({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-questrial',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OptimusCode.io | Turn Plain Text Into Production-Ready Apps',
  description: 'AI-powered full-stack web app generator. No templates. No boilerplate. Just full-stack code, zipped and ready.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${comfortaa.variable} ${questrial.variable}`}>
        <ParticleBackground />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
