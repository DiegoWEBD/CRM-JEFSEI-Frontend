'use client'

import { Button } from '@/components/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import { HistorialEstadoComercialLista } from './historial-estado-comercial-lista/historial-estado-comercial-lista'
import { HistorialEstadoJson } from '@/aplicacion/estados/dto/historial-estado-json'

type HistorialInteraccionesProps = {
	prospecto: Prospecto
	openHistorialEstadoDialog: boolean
	setOpenHistorialEstadoDialog: (open: boolean) => void
}

const HistorialEstados = ({
	prospecto,
	openHistorialEstadoDialog,
	setOpenHistorialEstadoDialog,
}: HistorialInteraccionesProps) => {
	//const historialEstados = prospecto.proceso_comercial.historial_estados
	const historialEstados: HistorialEstadoJson[] = []

	return (
		<Dialog
			open={openHistorialEstadoDialog}
			onOpenChange={setOpenHistorialEstadoDialog}
		>
			<DialogContent className='max-w-md gap-4'>
				<DialogHeader>
					<DialogTitle>Historial de estado comercial</DialogTitle>
				</DialogHeader>
				<HistorialEstadoComercialLista historial={historialEstados} />
				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={() => setOpenHistorialEstadoDialog(false)}
					>
						Cerrar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default HistorialEstados
