import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import AppLayout from '@/components/layouts/app-layout'
import Providers from '@/components/providers/providers'
import { getSession } from '@/lib/auth'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'CRM JEFSEI',
	description: 'Desarrollado por equipo JEFSEI',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await getSession()

	return (
		<html
			lang='en'
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className='h-screen flex overflow-hidden'>
				<Providers initialPayload={session}>
					<AppLayout>{children}</AppLayout>
				</Providers>
			</body>
		</html>
	)
}
