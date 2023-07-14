"use client";
import { Web3ReactProvider } from '@web3-react/core'
import './globals.scss'
import { Inter } from 'next/font/google'
import { Web3Provider } from '@ethersproject/providers'

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'QoinPay - Ticketing System',
//   description: 'Generated by Irwan',
// }

function getLibrary(provider: any) {
  return new Web3Provider(provider);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Web3ReactProvider getLibrary={getLibrary}>
        <body className={inter.className}>{children}</body>
      </Web3ReactProvider>
    </html>
  )
}
