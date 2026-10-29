'use client'

import { Button } from '@/components/button'
import { Card, CardHeader, CardTitle } from '@/components/card'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { useUserSession } from '@/hooks/auth/use-user-session'
import { useState } from 'react'
import DialogCambiarLineaNegocio from './dialog-cambiar-linea-negocio/dialog-cambiar-linea-negocio'
import FormularioActualizarProspecto from './formulario-actualizar-prospecto/formulario-actualizar-prospecto'
import InformacionProspecto from './informacion-prospecto/informacion-prospecto'

type InformacionProspectoProps = {
	prospecto: ProspectoCondominio
}

const CardInformacionProspecto = ({ prospecto }: InformacionProspectoProps) => {
	const [editar, setEditar] = useState(false)
	const { usuario, tienePermiso } = useUserSession()
	const rutsCoinciden = usuario?.rut === prospecto.ejecutivo_comercial_asignado?.rut
	const puedeCambiarLinea =
		rutsCoinciden && tienePermiso('CAMBIAR_LINEA_NEGOCIO_PROSPECTO')

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle primary>Información general del prospecto</CardTitle>
				<div className='flex flex-wrap items-center gap-2'>
					{!editar && puedeCambiarLinea && (
						<DialogCambiarLineaNegocio prospecto={prospecto} />
					)}
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
			{!editar && <InformacionProspecto prospecto={prospecto} />}
			{editar && rutsCoinciden && (
				<FormularioActualizarProspecto
					prospecto={prospecto}
					cancelarEdicionInformacion={() => setEditar(false)}
				/>
			)}
		</Card>
	)
}

export default CardInformacionProspecto
