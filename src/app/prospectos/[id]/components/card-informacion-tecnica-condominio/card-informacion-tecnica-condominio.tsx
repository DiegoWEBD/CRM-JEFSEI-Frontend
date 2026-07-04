'use client'

import { Button } from '@/components/button'
import { Card, CardHeader, CardTitle } from '@/components/card'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { useUserSession } from '@/hooks/auth/use-user-session'
import { useState } from 'react'
import FormularioActualizarInformacionTecnicaCondominio from './formulario-actualizar-informacion-tecnica-condominio/formulario-actualizar-informacion-tecnica-condominio'
import InformacionTecnicaCondominio from './informacion-tecnica-condominio/informacion-tecnica-condominio'

type CardInformacionTecnicaCondominioProps = {
	prospecto: ProspectoCondominio
}

export default function CardInformacionTecnicaCondominio({
	prospecto,
}: CardInformacionTecnicaCondominioProps) {
	const [editar, setEditar] = useState<boolean>(false)
	const { usuario } = useUserSession()
	const rutsCoinciden = usuario?.rut === prospecto.ejecutivo_comercial_asignado?.rut

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle primary>Información técnica del condominio</CardTitle>
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
			</CardHeader>
			{!editar && <InformacionTecnicaCondominio prospecto={prospecto} />}
			{editar && rutsCoinciden && (
				<FormularioActualizarInformacionTecnicaCondominio
					prospecto={prospecto}
					cancelarEdicionInformacion={() => setEditar(false)}
				/>
			)}
		</Card>
	)
}
