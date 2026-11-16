import { asignarPermisosRol } from '@/aplicacion/roles/use-cases/asignar-permisos-rol'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

type Props = {
	params: Promise<{ codigo: string }>
}

export async function PUT(request: Request, props: Props) {
	const { codigo } = await props.params

	try {
		const body = await request.json()
		const resultado = await asignarPermisosRol(codigo, {
			codigos_permiso: body.codigos_permiso,
		})

		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error actualizando los permisos del rol')
	}
}
