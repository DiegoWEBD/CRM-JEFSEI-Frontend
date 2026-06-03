'use client'

import Button from '@/components/button/button'
import Card from '@/components/card/card'
import CardHeader from '@/components/card/card-header/card-header'
import CardTitle from '@/components/card/card-title/card-title'
import EstadoCompletitudInformacion from '@/components/estado-completitud-informacion/estado-completitud-informacion'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import FormularioActualizarProspecto from './formulario-actualizar-prospecto/formulario-actualizar-prospecto'
import InformacionProspecto from './informacion-prospecto/informacion-prospecto'

type InformacionProspectoProps = {
	prospecto: ProspectoCondominio
}

const CardInformacionProspecto = ({ prospecto }: InformacionProspectoProps) => {
	const [editandoInformacion, setEditandoInformacion] = useState(false)

	return (
		<>
			<EstadoCompletitudInformacion
				completa={false}
				className='px-3 py-2.5 flex gap-2 w-full items-center justify-start'
			>
				<AlertTriangle className='mt-0.5 shrink-0 text-amber-600' aria-hidden />
				<p className='font-medium'>Faltan datos obligatorios del prospecto.</p>
			</EstadoCompletitudInformacion>

			<Card className='border-border bg-card shadow-none'>
				<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
					<CardTitle primary>Información general del prospecto</CardTitle>
					<AuthGuard codigosRoles={['EJECUTIVO_COMERCIAL']}>
						{!editandoInformacion && (
							<Button
								type='button'
								variant='outline'
								size='sm'
								className='h-8 text-xs'
								onClick={() => setEditandoInformacion(true)}
							>
								Editar información
							</Button>
						)}
					</AuthGuard>
				</CardHeader>
				{!editandoInformacion && <InformacionProspecto prospecto={prospecto} />}
				<AuthGuard codigosRoles={['EJECUTIVO_COMERCIAL']}>
					{editandoInformacion && (
						<FormularioActualizarProspecto
							prospecto={prospecto}
							cancelarEdicionInformacion={() => setEditandoInformacion(false)}
						/>
					)}
				</AuthGuard>
			</Card>
		</>
	)
}

export default CardInformacionProspecto
