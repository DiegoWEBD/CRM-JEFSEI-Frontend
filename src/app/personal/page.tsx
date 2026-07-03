import { Suspense } from 'react'
import { obtenerUsuarios } from '@/aplicacion/usuarios/use-cases/obtener-usuarios'
import PersonalClient from './components/personal-client'
import { PersonalPageSkeleton } from './components/personal-page-skeleton'
import { cookies } from 'next/headers'

async function PersonalInner() {
	const cookieStore = await cookies()
	const cookieHeader = cookieStore.toString()

	const usuarios = await obtenerUsuarios(cookieHeader)

	return <PersonalClient usuariosIniciales={usuarios} />
}

const PersonalPage = () => {
	return (
		<Suspense fallback={<PersonalPageSkeleton />}>
			<PersonalInner />
		</Suspense>
	)
}

export default PersonalPage
