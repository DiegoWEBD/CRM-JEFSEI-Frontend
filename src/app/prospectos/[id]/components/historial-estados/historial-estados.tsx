'use client'

import Button from '@/components/button/button'
import Dialog from '@/components/dialog/dialog'
import DialogContent from '@/components/dialog/dialog-content/dialog-content'
import DialogFooter from '@/components/dialog/dialog-footer/dialog-footer'
import DialogHeader from '@/components/dialog/dialog-header/dialog-hedaer'
import DialogTitle from '@/components/dialog/dialog-title/dialog-title'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import { HistorialEstadoComercialLista } from './historial-estado-comercial-lista/historial-estado-comercial-lista'

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
	const historialEstados = prospecto.proceso_comercial.historial_estados

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
