import { Suspense } from 'react'
import { obtenerProspecto } from '@/aplicacion/prospectos/use-cases/obtener-prospecto/obtener-prospecto'
import { cookies } from 'next/headers'
import PaginaProspectoClient from './components/pagina-prospecto-client/pagina-prospecto-client'
import { ProspectoPageSkeleton } from './components/prospecto-page-skeleton'

type ProspectoPageProps = {
	params: Promise<{
		id: string
	}>
}

async function ProspectoInner({ id }: { id: string }) {
	const cookieStore = await cookies()
	const cookieHeader = cookieStore.toString()

	const prospecto = await obtenerProspecto(Number(id), cookieHeader)

	return <PaginaProspectoClient prospectoInicial={prospecto} />
}

export default async function ProspectoPage({ params }: ProspectoPageProps) {
	const { id } = await params

	return (
		<Suspense fallback={<ProspectoPageSkeleton />}>
			<ProspectoInner id={id} />
		</Suspense>
	)
}
