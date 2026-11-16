import { actualizarRolesUsuario } from '@/aplicacion/usuarios/use-cases/actualizar-roles-usuario'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

type Props = {
	params: Promise<{ rut: string }>
}

export async function PUT(request: Request, props: Props) {
	const { rut } = await props.params

	try {
		const body = await request.json()
		const resultado = await actualizarRolesUsuario(rut, {
			codigo_roles: body.codigo_roles,
		})

		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error actualizando los roles del usuario')
	}
}
