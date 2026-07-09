'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { CuotaDashboard } from '@/dominio/cobranza/dashboard-cobranza'
import { useMarcarPagoCuota } from '@/hooks/cuotas/use-marcar-pago-cuota'

type DialogRegistrarPagoProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	cuota: CuotaDashboard | null
}

export default function DialogRegistrarPago({
	open,
	onOpenChange,
	cuota,
}: DialogRegistrarPagoProps) {
	const marcarPago = useMarcarPagoCuota()

	const handleConfirm = useCallback(async () => {
		if (!cuota) return
		try {
			const result = await marcarPago.mutateAsync(cuota.id)
			toast.success(result.message)
		} finally {
			onOpenChange(false)
		}
	}, [cuota, marcarPago, onOpenChange])

	const descripcion = cuota
		? `¿Estás seguro de marcar como pagada la cuota #${cuota.numero_cuota}/${cuota.total_cuotas} de ${cuota.nombre_cliente} (póliza ${cuota.numero_poliza})? Esta acción es irreversible.`
		: '¿Estás seguro de marcar esta cuota como pagada? Esta acción es irreversible.'

	return (
		<ConfirmDialog
			open={open}
			onOpenChange={onOpenChange}
			title='Marcar cuota como pagada'
			description={descripcion}
			confirmText='Sí, pagar'
			onConfirm={handleConfirm}
			variant='destructive'
			isPending={marcarPago.isPending}
		/>
	)
}
