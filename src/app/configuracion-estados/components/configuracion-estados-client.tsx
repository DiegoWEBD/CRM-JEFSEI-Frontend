'use client'

import { EstadoConfiguracion } from '@/aplicacion/estados-admin/dto/estado-configuracion'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { useEstadosConfiguracion } from '@/hooks/estados-admin/use-estados-configuracion'
import { useDebounce } from '@/hooks/use-debounce'
import { useMemo, useState } from 'react'

import DialogConfigurarEstado from './panel-estados-admin/dialog-configurar-estado'
import FiltrosEstados from './panel-estados-admin/filtros-estados'
import TablaEstados from './panel-estados-admin/tabla-estados'
import TransicionesEstado from './panel-estados-admin/transiciones-estado'

export default function ConfiguracionEstadosClient() {
	const [inputBusqueda, setInputBusqueda] = useState('')
	const textoBusqueda = useDebounce(inputBusqueda, 300)

	const { data, isFetching, isLoading } = useEstadosConfiguracion()
	const etapas = useMemo(() => data?.data ?? [], [data])

	const [estadoAConfigurar, setEstadoAConfigurar] =
		useState<EstadoConfiguracion | null>(null)
	const [estadoTransiciones, setEstadoTransiciones] =
		useState<EstadoConfiguracion | null>(null)

	const estadosPlanos = useMemo(
		() => etapas.flatMap(etapa => etapa.estados),
		[etapas],
	)

	/**
	 * Filtra los estados de cada etapa y descarta las etapas que quedan sin
	 * resultados, preservando el orden en que las entrega la API.
	 *
	 * Al buscar por nombre de etapa coinciden todos sus estados, de modo que
	 * la etapa completa se mantiene visible.
	 */
	const etapasFiltradas = useMemo(() => {
		const texto = textoBusqueda.trim().toLowerCase()
		if (!texto) return etapas

		return etapas
			.map(etapa => ({
				...etapa,
				estados: etapa.estados.filter(
					estado =>
						estado.nombre.toLowerCase().includes(texto) ||
						estado.codigo.toLowerCase().includes(texto) ||
						estado.nombre_etapa.toLowerCase().includes(texto),
				),
			}))
			.filter(etapa => etapa.estados.length > 0)
	}, [etapas, textoBusqueda])

	const totalEstados = useMemo(
		() => estadosPlanos.length,
		[estadosPlanos],
	)
	const totalFiltrados = useMemo(
		() => etapasFiltradas.reduce((suma, etapa) => suma + etapa.estados.length, 0),
		[etapasFiltradas],
	)

	// El estado seleccionado se refresca contra la última versión de la lista,
	// de modo que la cantidad de transiciones refleje los cambios recientes.
	const estadoTransicionesActual = estadoTransiciones
		? (estadosPlanos.find(e => e.codigo === estadoTransiciones.codigo) ??
			estadoTransiciones)
		: null

	return (
		<PanelLayout>
			<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border/80 p-3 sm:p-4'>
					<FiltrosEstados
						busqueda={inputBusqueda}
						onBusquedaChange={setInputBusqueda}
						total={totalEstados}
						totalFiltrados={totalFiltrados}
					/>
				</div>

				<div className='p-3 sm:p-4'>
					<TablaEstados
						etapas={etapasFiltradas}
						isFetching={isFetching && isLoading}
						codigoEstadoTransiciones={
							estadoTransicionesActual?.codigo ?? null
						}
						onConfigurar={setEstadoAConfigurar}
						onVerTransiciones={estado =>
							setEstadoTransiciones(prev =>
								prev?.codigo === estado.codigo ? null : estado,
							)
						}
					/>
				</div>
			</section>

			{estadoTransicionesActual && (
				<TransicionesEstado
					estado={estadoTransicionesActual}
					estados={estadosPlanos}
					onCerrar={() => setEstadoTransiciones(null)}
				/>
			)}

			<DialogConfigurarEstado
				estado={estadoAConfigurar ?? undefined}
				dialogAbierto={estadoAConfigurar !== null}
				cerrarDialog={() => setEstadoAConfigurar(null)}
			/>
		</PanelLayout>
	)
}
