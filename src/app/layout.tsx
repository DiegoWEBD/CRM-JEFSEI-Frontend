import type { Metadata, Viewport } from 'next'
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
	title: {
		default: 'CRM JEFSEI',
		template: '%s · CRM JEFSEI',
	},
	description: 'Plataforma de gestión comercial y seguros JEFSEI',
	applicationName: 'CRM JEFSEI',
}

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#f7f8fb' },
		{ media: '(prefers-color-scheme: dark)', color: '#1a1c24' },
	],
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await getSession()

	return (
		<html
			lang='es'
			suppressHydrationWarning
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