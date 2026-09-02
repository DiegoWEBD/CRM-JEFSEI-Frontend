import { getSession } from '@/lib/auth'
import Header from '../header/header'
import SideBar from '../sidebar/sidebar'
import AuthGuard from './guards/auth-guard'
import MainContentLayout from './main-content-layout/main-content-layout'

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await getSession()

	const autenticado = !!session

	return (
		<>
			<AuthGuard>
				<SideBar />
			</AuthGuard>

			<div className='flex flex-col flex-1 min-w-0'>
				<AuthGuard>
					<Header />
				</AuthGuard>

				<MainContentLayout
					bare={!autenticado}
					className={
						!autenticado ? 'bg-secondary flex items-center justify-center' : ''
					}
				>
					{children}
				</MainContentLayout>
			</div>
		</>
	)
}
