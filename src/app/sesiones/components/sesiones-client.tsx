'use client'

import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs'
import Sesion from '@/dominio/sesion/sesion'
import { useSesiones } from '@/hooks/sesiones/use-sesiones'
import { useDebounce } from '@/hooks/use-debounce'
import { useState } from 'react'
import DialogRevocarSesion from './dialog-revocar-sesion'
import FiltrosSesiones from './filtros-sesiones'
import TablaSesiones from './tabla-sesiones'

type EstadoSesion = 'activas' | 'inactivas' | 'todas'

export default function SesionesClient() {
	const [tab, setTab] = useState<EstadoSesion>('activas')
	const [pagina, setPagina] = useState(1)
	const [inputBusqueda, setInputBusqueda] = useState('')
	const textoBusqueda = useDebounce(inputBusqueda, 300)
	const [rutUsuario, setRutUsuario] = useState('')
	const [sesionSeleccionada, setSesionSeleccionada] =
		useState<Sesion | null>(null)

	const {
		data: respuesta,
		isFetching,
		refetch,
	} = useSesiones({
		textoBusqueda,
		rutUsuario: rutUsuario || null,
		estado: tab,
		pagina,
	})

	const cambiarTab = (valor: string) => {
		setTab(valor as EstadoSesion)
		setPagina(1)
	}

	return (
		<PanelLayout>
			<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border/80 p-3 sm:p-4'>
					<Tabs value={tab} onValueChange={cambiarTab}>
						<TabsList>
							<TabsTrigger value='activas'>Activas</TabsTrigger>
							<TabsTrigger value='inactivas'>Inactivas</TabsTrigger>
							<TabsTrigger value='todas'>Todas</TabsTrigger>
						</TabsList>
					</Tabs>

					<div className='mt-3'>
						<FiltrosSesiones
							busqueda={inputBusqueda}
							onBusquedaChange={valor => {
								setInputBusqueda(valor)
								setPagina(1)
							}}
							rutUsuario={rutUsuario}
							onRutUsuarioChange={valor => {
								setRutUsuario(valor)
								setPagina(1)
							}}
							total={respuesta?.total || 0}
							totalPagina={respuesta?.data.length || 0}
							onActualizar={() => refetch()}
							actualizando={isFetching}
						/>
					</div>
				</div>

				<div className='p-3 sm:p-4'>
					<TablaSesiones
						sesiones={respuesta?.data || []}
						isFetching={isFetching}
						pagina={pagina}
						totalPaginas={respuesta?.total_paginas || 0}
						onPaginaChange={setPagina}
						onRevocar={setSesionSeleccionada}
					/>
				</div>
			</section>

			<DialogRevocarSesion
				sesion={sesionSeleccionada}
				cerrarDialog={() => setSesionSeleccionada(null)}
			/>
		</PanelLayout>
	)
}