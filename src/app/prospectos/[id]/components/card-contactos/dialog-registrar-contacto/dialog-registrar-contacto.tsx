'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import { useRegistrarContacto } from '@/hooks/contactos/use-registrar-contacto'
import FormularioContacto, {
	type FormularioContactoValues,
} from '../formulario-contacto/formulario-contacto'

type DialogRegistrarContactoProps = {
	idProspecto: number
	open: boolean
	onOpenChange: (open: boolean) => void
}

const INITIAL_VALUES: FormularioContactoValues = {
	nombre: '',
	cargo: '',
	telefono: '',
	correo: '',
}

export default function DialogRegistrarContacto({
	idProspecto,
	open,
	onOpenChange,
}: DialogRegistrarContactoProps) {
	const mutation = useRegistrarContacto(idProspecto)

	const handleSubmit = async (values: FormularioContactoValues) => {
		await mutation.mutateAsync({
			nombre: values.nombre,
			cargo: values.cargo || null,
			telefono: values.telefono || null,
			correo: values.correo || null,
		})
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-lg'>
				<DialogHeader>
					<DialogTitle className='text-base'>Agregar contacto</DialogTitle>
					<DialogDescription>
						Registra un nuevo contacto asociado a este prospecto.
					</DialogDescription>
				</DialogHeader>
				<FormularioContacto
					initialValues={INITIAL_VALUES}
					onSubmit={handleSubmit}
					onCancel={() => onOpenChange(false)}
					cargando={mutation.isPending}
				/>
			</DialogContent>
		</Dialog>
	)
}