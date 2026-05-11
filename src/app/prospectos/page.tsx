'use client'

import ProspectoResumenJson from '@/aplicacion/prospectos/dto/prospecto-resumen-json'
import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos'
import CardProspectos from '@/components/prospectos/card-prospectos/card-prospectos'
import CardProspectosSkeleton from '@/components/prospectos/card-prospectos/card-prospectos-skeleton'
import TituloPagina from '@/components/titulos/titulo-pagina'
import { Suspense, use, useEffect, useMemo, useState } from 'react'
import FormularioRegistrarProspecto from './components/formulario-registrar-prospecto/formulario-registrar-prospecto'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import Modal from '@/components/modal/modal'
import Button from '@/components/botones/button'

type ProspectosListadoProps = {
	prospectosPromise: Promise<ProspectoResumenJson[]>
}

const ProspectosListado = ({ prospectosPromise }: ProspectosListadoProps) => {
	const prospectos = use(prospectosPromise)
	return <CardProspectos prospectos={prospectos} />
}

const ProspectosPage = () => {
	const [openModalRegistro, setOpenModalRegistro] = useState<boolean>(false)
	const [recargaProspectos, setRecargaProspectos] = useState(0)
	// Evitar fetch en SSR: axios usa credenciales del navegador; en el servidor no hay sesión → 401.
	const [mounted, setMounted] = useState(false)
	useEffect(() => {
		setMounted(true)
	}, [])

	const prospectosPromise = useMemo(() => {
		if (!mounted) return null
		return obtenerProspectos()
	}, [mounted, recargaProspectos])

	return (
		<>
			<TituloPagina>Prospectos</TituloPagina>
			<PanelLayout>
				<Button onClick={() => setOpenModalRegistro(true)}>
					Registrar prospecto
				</Button>
				{prospectosPromise ? (
					<Suspense fallback={<CardProspectosSkeleton />}>
						<ProspectosListado prospectosPromise={prospectosPromise} />
					</Suspense>
				) : (
					<CardProspectosSkeleton />
				)}
			</PanelLayout>
			<Modal
				open={openModalRegistro}
				onClose={() => setOpenModalRegistro(false)}
				title='Registrar prospecto'
			>
				<FormularioRegistrarProspecto
					onProspectoRegistrado={() =>
						setRecargaProspectos(current => current + 1)
					}
					onClose={() => setOpenModalRegistro(false)}
				/>
			</Modal>
		</>
	)
}

export default ProspectosPage
