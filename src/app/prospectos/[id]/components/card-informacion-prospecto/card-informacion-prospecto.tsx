'use client'

import { Button } from '@/components/button'
import { Card, CardHeader, CardTitle } from '@/components/card'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { useState } from 'react'
import FormularioActualizarProspecto from './formulario-actualizar-prospecto/formulario-actualizar-prospecto'
import InformacionProspecto from './informacion-prospecto/informacion-prospecto'

type InformacionProspectoProps = {
	prospecto: ProspectoCondominio
}

const CardInformacionProspecto = ({ prospecto }: InformacionProspectoProps) => {
	const [editar, setEditar] = useState(false)

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle primary>Información general del prospecto</CardTitle>
				<AuthGuard allowedRoles={['EJECUTIVO_COMERCIAL']}>
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
			{!editar && <InformacionProspecto prospecto={prospecto} />}
			<AuthGuard allowedRoles={['EJECUTIVO_COMERCIAL']}>
				{editar && (
					<FormularioActualizarProspecto
						prospecto={prospecto}
						cancelarEdicionInformacion={() => setEditar(false)}
					/>
				)}
			</AuthGuard>
		</Card>
	)
}

export default CardInformacionProspecto
