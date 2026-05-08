'use client'

import CardProspectos from '@/components/prospectos/card-prospectos/card-prospectos'
import TituloPagina from '@/components/titulos/titulo-pagina'
import { useProspectos } from '@/hooks/prospectos/use-prospectos'
import { useEffect, useState } from 'react'
import FormularioRegistrarProspecto from './components/formulario-registrar-prospecto/formulario-registrar-prospecto'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import Modal from '@/components/modal/modal'
import Button from '@/components/botones/button'

const ProspectosPage = () => {
	const { prospectos, cargando, cargarProspectos } = useProspectos()
	const [openModalRegistro, setOpenModalRegistro] = useState<boolean>(false)

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
			>
				<FormularioRegistrarProspecto />
			</Modal>
		</>
	)
}

export default ProspectosPage
