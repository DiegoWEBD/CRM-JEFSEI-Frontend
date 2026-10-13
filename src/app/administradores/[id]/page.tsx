import { Suspense } from 'react'
import { obtenerAdministradorPorId } from '@/aplicacion/administradores/use-cases/obtener-administrador-por-id/obtener-administrador-por-id'
import AdministradorClient from './components/administrador-client'
import { AdministradorPageSkeleton } from './components/administrador-page-skeleton'
import { redirect } from 'next/navigation'

type PageProps = {
	params: Promise<{ id: string }>
}

async function AdministradorInner({ id }: { id: string }) {
	let administrador
	try {
		administrador = await obtenerAdministradorPorId(Number(id))
	} catch {
		redirect('/')
	}
	return <AdministradorClient administradorInicial={administrador} />
}

export default async function AdministradorPage({ params }: PageProps) {
	const { id } = await params

	return (
		<Suspense fallback={<AdministradorPageSkeleton />}>
			<AdministradorInner id={id} />
		</Suspense>
	)
}
