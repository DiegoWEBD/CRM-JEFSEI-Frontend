import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { SidebarInset, SidebarProvider } from '@/components/sidebar'
import AppSidebar from '../app-sidebar/app-sidebar'
import Header from '../header/header'
import AuthGuard from './guards/auth-guard'
import MainContentLayout from './main-content-layout/main-content-layout'

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await getSession()

	const autenticado = !!session

	/** Estado expandido/colapsado persistido por SidebarProvider en la cookie `sidebar_state`. */
	const cookieStore = await cookies()
	const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			{autenticado && (
				<AuthGuard>
					<AppSidebar />
				</AuthGuard>
			)}

			<SidebarInset className='min-w-0'>
				{autenticado && (
					<AuthGuard>
						<Header />
					</AuthGuard>
				)}

				<MainContentLayout
					bare={!autenticado}
					className={
						!autenticado ? 'bg-secondary flex items-center justify-center' : ''
					}
				>
					{children}
				</MainContentLayout>
			</SidebarInset>
		</SidebarProvider>
	)
}
