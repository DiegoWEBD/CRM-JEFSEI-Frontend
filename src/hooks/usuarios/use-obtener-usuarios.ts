'use client'

import { obtenerUsuarios } from '@/aplicacion/usuarios/use-cases/obtener-usuarios'
import Usuario from '@/dominio/usuario/usuario'
import { useEffect, useState } from 'react'

export const useObtenerUsuarios = () => {
	const [usuarios, setUsuarios] = useState<Usuario[]>([])

	useEffect(() => {
		obtenerUsuarios()
			.then(setUsuarios)
			.catch(error => {
				console.log(error)
			})
	}, [])

	return { usuarios }
}
