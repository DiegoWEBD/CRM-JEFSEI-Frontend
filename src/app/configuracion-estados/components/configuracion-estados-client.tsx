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
	const estados = useMemo(() => data?.data ?? [], [data])

	const [estadoAConfigurar, setEstadoAConfigurar] =
		useState<EstadoConfiguracion | null>(null)
	const [estadoTransiciones, setEstadoTransiciones] =
		useState<EstadoConfiguracion | null>(null)

	const estadosFiltrados = useMemo(() => {
		const texto = textoBusqueda.trim().toLowerCase()
		if (!texto) return estados

		return estados.filter(
			estado =>
				estado.nombre.toLowerCase().includes(texto) ||
				estado.nombre_etapa.toLowerCase().includes(texto) ||
				estado.codigo.toLowerCase().includes(texto),
		)
	}, [estados, textoBusqueda])

	// El estado seleccionado se refresca contra la última versión de la lista,
	// de modo que la cantidad de transiciones refleje los cambios recientes.
	const estadoTransicionesActual = estadoTransiciones
		? (estados.find(e => e.codigo === estadoTransiciones.codigo) ??
			estadoTransiciones)
		: null

	return (
		<PanelLayout>
			<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border/80 p-3 sm:p-4'>
					<FiltrosEstados
						busqueda={inputBusqueda}
						onBusquedaChange={setInputBusqueda}
						total={estados.length}
						totalFiltrados={estadosFiltrados.length}
					/>
				</div>

				<div className='p-3 sm:p-4'>
					<TablaEstados
						estados={estadosFiltrados}
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
					estados={estados}
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
