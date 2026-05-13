'use client'

import Button from '@/components/botones/button'
import Modal from '@/components/modal/modal'
import { useState } from 'react'
import FormularioRegistrarProspecto from '../formulario-registrar-prospecto/formulario-registrar-prospecto'

const ComponenteRegistrarProspecto = () => {
	const [openModalRegistro, setOpenModalRegistro] = useState(false)

	return (
		<>
			<Button onClick={() => setOpenModalRegistro(true)}>
				Registrar prospecto
			</Button>
			<Modal
				open={openModalRegistro}
				onClose={() => setOpenModalRegistro(false)}
				title='Registrar prospecto'
			>
				<FormularioRegistrarProspecto
					onClose={() => setOpenModalRegistro(false)}
				/>
			</Modal>
		</>
	)
}

export default ComponenteRegistrarProspecto
