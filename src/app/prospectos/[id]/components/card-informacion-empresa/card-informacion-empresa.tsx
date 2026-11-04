'use client'

import { Button } from '@/components/button'
import { Card, CardHeader, CardTitle } from '@/components/card'
import { ProspectoEmpresa } from '@/dominio/prospecto-empresa/prospecto-empresa'
import { useUserSession } from '@/hooks/auth/use-user-session'
import { useState } from 'react'
import FormularioActualizarInformacionTecnicaEmpresa from './formulario-actualizar-informacion-tecnica-empresa/formulario-actualizar-informacion-tecnica-empresa'
import InformacionTecnicaEmpresa from './informacion-tecnica-empresa/informacion-tecnica-empresa'

type CardInformacionEmpresaProps = {
	prospecto: ProspectoEmpresa
}

export default function CardInformacionEmpresa({
	prospecto,
}: CardInformacionEmpresaProps) {
	const [editar, setEditar] = useState<boolean>(false)

	const { usuario } = useUserSession()
	const rutsCoinciden =
		usuario?.rut === prospecto.ejecutivo_comercial_asignado?.rut

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle className='text-sm font-semibold leading-tight tracking-tight text-foreground'>
					Información de la empresa
				</CardTitle>
				<div className='flex flex-wrap gap-2'>
					{!editar && rutsCoinciden && (
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-8 text-xs'
							onClick={() => setEditar(true)}
						>
							Editar información
						</Button>
					)}
				</div>
			</CardHeader>
			{!editar && <InformacionTecnicaEmpresa prospecto={prospecto} />}
			{editar && rutsCoinciden && (
				<FormularioActualizarInformacionTecnicaEmpresa
					prospecto={prospecto}
					cancelarEdicionInformacion={() => setEditar(false)}
				/>
			)}
		</Card>
	)
}
