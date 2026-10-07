'use client'

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/alert-dialog'
import { Button } from '@/components/button'
import Sesion from '@/dominio/sesion/sesion'
import { useRevocarSesion } from '@/hooks/sesiones/use-revocar-sesion'
import { useRevocarTodasSesionesUsuario } from '@/hooks/sesiones/use-revocar-todas-sesiones-usuario'

type DialogRevocarSesionProps = {
	sesion: Sesion | null
	cerrarDialog: () => void
}

export default function DialogRevocarSesion({
	sesion,
	cerrarDialog,
}: DialogRevocarSesionProps) {
	const revocarMutation = useRevocarSesion()
	const revocarTodasMutation = useRevocarTodasSesionesUsuario()

	const isPending = revocarMutation.isPending || revocarTodasMutation.isPending

	const handleRevocarUna = () => {
		if (!sesion) return
		revocarMutation.mutate(sesion.id, { onSuccess: cerrarDialog })
	}

	const handleRevocarTodas = () => {
		if (!sesion) return
		revocarTodasMutation.mutate(sesion.rut_usuario, {
			onSuccess: cerrarDialog,
		})
	}

	const nombreMostrado = sesion?.nombre_usuario ?? sesion?.rut_usuario ?? ''
	const dispositivoMostrado = sesion?.dispositivo ?? 'este dispositivo'

	return (
		<AlertDialog open={sesion !== null} onOpenChange={() => cerrarDialog()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Revocar sesión</AlertDialogTitle>
					<AlertDialogDescription>
						¿Estás seguro de revocar la sesión de{' '}
						<strong>{nombreMostrado}</strong> en{' '}
						<strong>{dispositivoMostrado}</strong>?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className='flex-col gap-2 sm:flex-row'>
					<AlertDialogCancel disabled={isPending}>
						Cancelar
					</AlertDialogCancel>
					<Button
						type='button'
						variant='outline'
						size='sm'
						className='text-xs shadow-none'
						disabled={isPending}
						onClick={handleRevocarUna}
					>
						{revocarMutation.isPending
							? 'Revocando...'
							: 'Revocar este dispositivo'}
					</Button>
					<Button
						type='button'
						variant='destructive'
						size='sm'
						className='text-xs shadow-none'
						disabled={isPending}
						onClick={handleRevocarTodas}
					>
						{revocarTodasMutation.isPending
							? 'Revocando...'
							: 'Revocar todos los dispositivos'}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}