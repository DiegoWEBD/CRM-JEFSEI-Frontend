import { useCallback, useState } from 'react'

export const useHistorialEstadoDialog = () => {
	const [openHistorialEstadoDialog, setOpenHistorialEstadoDialog] =
		useState<boolean>(false)

	const abrirDialogHistorialEstado = useCallback(
		() => setOpenHistorialEstadoDialog(true),
		[],
	)
	const cerrarDialogHistorialEstado = useCallback(
		() => setOpenHistorialEstadoDialog(false),
		[],
	)

	return {
		openHistorialEstadoDialog,
		abrirDialogHistorialEstado,
		cerrarDialogHistorialEstado,
		setOpenHistorialEstadoDialog,
	}
}
