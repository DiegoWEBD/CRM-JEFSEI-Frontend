'use client'

import { useObtenerUsuarios } from '@/hooks/usuarios/use-obtener-usuarios'
import ContenedorUsuarios from './components/contenedor-usuarios'

const PersonalPage = () => {
	const { usuarios } = useObtenerUsuarios()

	return (
		<>
			<h1>Gestión de Personal</h1>
			<ContenedorUsuarios usuarios={usuarios} />
		</>
	)
}

export default PersonalPage
