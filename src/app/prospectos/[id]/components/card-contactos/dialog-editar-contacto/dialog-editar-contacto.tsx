'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import Contacto from '@/dominio/contacto/contacto'
import { useActualizarContacto } from '@/hooks/contactos/use-actualizar-contacto'
import FormularioContacto, {
	type FormularioContactoValues,
} from '../formulario-contacto/formulario-contacto'

type DialogEditarContactoProps = {
	idProspecto: number
	contacto: Contacto | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export default function DialogEditarContacto({
	idProspecto,
	contacto,
	open,
	onOpenChange,
}: DialogEditarContactoProps) {
	const mutation = useActualizarContacto(idProspecto)

	if (!contacto) return null

	const initialValues: FormularioContactoValues = {
		nombre: contacto.nombre,
		cargo: contacto.cargo ?? '',
		telefono: contacto.telefono ?? '',
		correo: contacto.correo ?? '',
	}

	const handleSubmit = async (values: FormularioContactoValues) => {
		await mutation.mutateAsync({
			id: contacto.id,
			data: {
				nombre: values.nombre,
				cargo: values.cargo || null,
				telefono: values.telefono || null,
				correo: values.correo || null,
			},
		})
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-lg'>
				<DialogHeader>
					<DialogTitle className='text-base'>Editar contacto</DialogTitle>
					<DialogDescription>
						Actualiza los datos del contacto.
					</DialogDescription>
				</DialogHeader>
				<FormularioContacto
					initialValues={initialValues}
					onSubmit={handleSubmit}
					onCancel={() => onOpenChange(false)}
					cargando={mutation.isPending}
				/>
			</DialogContent>
		</Dialog>
	)
}