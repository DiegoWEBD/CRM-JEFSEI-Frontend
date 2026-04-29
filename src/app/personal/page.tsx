'use client'

import { useObtenerUsuarios } from '@/hooks/usuarios/use-obtener-usuarios'

const PersonalPage = () => {
	const { usuarios } = useObtenerUsuarios()

	return <>Personal</>
}

export default PersonalPage
