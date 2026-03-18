import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JP Store — Verificação',
  description: 'Verificação de identidade Discord para JP Store',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
