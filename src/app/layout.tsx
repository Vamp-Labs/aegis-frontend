import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { type ReactNode } from 'react'
import { cookieToInitialState } from 'wagmi'

import { getConfig } from '../wagmi'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { AuthGuard } from '@/components/guards/AuthGuard'
import { TransactionModal } from '@/components/shared/TransactionModal'

export const metadata: Metadata = {
  title: 'Aegis Web Demo',
  description: 'Frontend integration for NestJS REST Contracts',
}

export default async function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get('cookie'),
  )
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers initialState={initialState}>
          <Toaster position="top-right" />
          <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden w-full">
                <Navbar />
                <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 w-full max-w-7xl mx-auto">
                  {props.children}
                  <TransactionModal />
                </main>
              </div>
            </div>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  )
}
