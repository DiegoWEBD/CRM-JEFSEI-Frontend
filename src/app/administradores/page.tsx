import { Suspense } from 'react'
import { obtenerAdministradores } from '@/aplicacion/administradores/use-cases/obtener-administradores/obtener-administradores'
import AdministradoresClient from './components/administradores-client'
import { AdministradoresPageSkeleton } from './components/administradores-page-skeleton'

async function AdministradoresInner() {
	const resultado = await obtenerAdministradores({ pagina: 1, tamanoPagina: 10 })

	return <AdministradoresClient initialData={resultado} />
}

const AdministradoresPage = () => {
	return (
		<Suspense fallback={<AdministradoresPageSkeleton />}>
			<AdministradoresInner />
		</Suspense>
	)
}

export default AdministradoresPage
