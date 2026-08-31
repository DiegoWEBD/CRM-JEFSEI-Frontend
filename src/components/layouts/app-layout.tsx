import Header from '../header/header'
import SideBar from '../sidebar/sidebar'
import MainContentLayout from './main-content-layout/main-content-layout'
import SessionWatcher from './session-watcher'
import { getSession } from '@/lib/auth'

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await getSession()

	const autenticado = !!session

	return (
		<>
			<SessionWatcher autenticado={autenticado} />

			{autenticado && <SideBar />}

			<div className='flex flex-col flex-1 min-w-0'>
				{autenticado && <Header />}

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
