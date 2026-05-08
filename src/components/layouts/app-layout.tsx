'use client'

import { useAuthStore } from '@/global_states/auth-store'
import Header from '../header/header'
import SideBar from '../sidebar/sidebar'
import AuthGuard from './guards/auth-guard'
import MainContentLayout from './main-content-layout/main-content-layout'

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const { usuario, expiresAt, hydrated } = useAuthStore()

	const isAuthenticated = hydrated && usuario && expiresAt

	return (
		<body className='h-screen flex'>
			<AuthGuard>
				<SideBar />
			</AuthGuard>

			<div className='flex flex-col flex-1'>
				<AuthGuard>
					<Header />
				</AuthGuard>

				<MainContentLayout
					className={
						!isAuthenticated
							? 'bg-secondary flex items-center justify-center'
							: ''
					}
				>
					{children}
				</MainContentLayout>
			</div>
		</body>
	)
}
