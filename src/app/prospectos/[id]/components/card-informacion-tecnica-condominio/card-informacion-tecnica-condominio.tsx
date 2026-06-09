'use client'

import Button from '@/components/button/button'
import Card from '@/components/card/card'
import CardHeader from '@/components/card/card-header/card-header'
import CardTitle from '@/components/card/card-title/card-title'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
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

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle primary>Información técnica del condominio</CardTitle>
				<AuthGuard codigosRoles={['EJECUTIVO_COMERCIAL']}>
					{!editar && (
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
				</AuthGuard>
			</CardHeader>
			{!editar && <InformacionTecnicaCondominio prospecto={prospecto} />}
			<AuthGuard codigosRoles={['EJECUTIVO_COMERCIAL']}>
				{editar && (
					<FormularioActualizarInformacionTecnicaCondominio
						prospecto={prospecto}
						cancelarEdicionInformacion={() => setEditar(false)}
					/>
				)}
			</AuthGuard>
		</Card>
	)
}
