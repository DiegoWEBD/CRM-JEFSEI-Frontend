import { Suspense } from 'react'
import PanelHome from '@/components/paneles/home/panel-home'
import { PanelHomeSkeleton } from '@/components/paneles/home/panel-home-skeleton'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
	const session = await getSession()

	if (!session) redirect('/login')

	return (
		<Suspense fallback={<PanelHomeSkeleton />}>
			<PanelHome />
		</Suspense>
	)
}
