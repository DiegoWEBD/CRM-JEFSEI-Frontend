'use client'

import Button from '@/components/botones/button'
import Modal from '@/components/modal/modal'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import CardProspectos from '@/components/prospectos/card-prospectos/card-prospectos'
import TituloPagina from '@/components/titulos/titulo-pagina'
import { useProspectos } from '@/hooks/prospectos/use-prospectos'
import { useEffect, useState } from 'react'
import FormularioRegistrarProspecto from './components/formulario-registrar-prospecto/formulario-registrar-prospecto'

const ProspectosPage = () => {
	const [openModalRegistro, setOpenModalRegistro] = useState<boolean>(false)
	const { prospectos, cargarProspectos } = useProspectos()

	useEffect(() => {
		cargarProspectos()
	}, [cargarProspectos])

	return (
		<>
			<TituloPagina>Prospectos</TituloPagina>

			<PanelLayout>
				<Button onClick={() => setOpenModalRegistro(true)}>
					Registrar prospecto
				</Button>

				<CardProspectos prospectos={prospectos} />
			</PanelLayout>

			<Modal
				open={openModalRegistro}
				onClose={() => setOpenModalRegistro(false)}
				title='Registrar prospecto'
			>
				<FormularioRegistrarProspecto
					onProspectoRegistrado={cargarProspectos}
					onClose={() => setOpenModalRegistro(false)}
				/>
			</Modal>
		</>
	)
}

export default ProspectosPage
