import { Suspense } from 'react'
import { obtenerUsuarios } from '@/aplicacion/usuarios/use-cases/obtener-usuarios'
import ContenedorUsuarios from './components/contenedor-usuarios'
import { PersonalPageSkeleton } from './components/personal-page-skeleton'
import { cookies } from 'next/headers'

async function PersonalInner() {
	const cookieStore = await cookies()
	const cookieHeader = cookieStore.toString()

	const usuarios = await obtenerUsuarios(cookieHeader)

	return (
		<>
			<ContenedorUsuarios usuarios={usuarios} />
		</>
	)
}

const PersonalPage = () => {
	return (
		<Suspense fallback={<PersonalPageSkeleton />}>
			<PersonalInner />
		</Suspense>
	)
}

export default PersonalPage
