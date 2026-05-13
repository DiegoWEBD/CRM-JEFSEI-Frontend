import { obtenerUsuarios } from '@/aplicacion/usuarios/use-cases/obtener-usuarios'
import ContenedorUsuarios from './components/contenedor-usuarios'
import { cookies } from 'next/headers'

const PersonalPage = async () => {
	const cookieStore = await cookies()
	const cookieHeader = cookieStore.toString()

	const usuarios = await obtenerUsuarios(cookieHeader)

	return (
		<>
			<h1>Gestión de Personal</h1>
			<ContenedorUsuarios usuarios={usuarios} />
		</>
	)
}

export default PersonalPage
