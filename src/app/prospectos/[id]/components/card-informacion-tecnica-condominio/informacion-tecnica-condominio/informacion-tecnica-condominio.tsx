import { CardContent } from '@/components/card'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import {
	CLASIFICACION_PRELIMINAR_INCENDIO_LABELS,
	MATERIALIDAD_PRINCIPAL_LABELS,
} from '@/lib/materialidades'
import { UBICACION_PISCINA_LABELS } from '@/lib/ubicacion.piscina'
import { formatUF } from '@/lib/uf'
import { inputPendiente } from '@/utils/input/input-pendiente'
import {
	Building2,
	Calendar,
	DollarSign,
	FireExtinguisher,
	Flame,
	Home,
	Layers,
	LayoutGrid,
	MapPin,
	Ruler,
	Shield,
	Waves,
} from 'lucide-react'
import DataItemProspecto from './data-item-prospecto/data-item-prospecto'

type InformacionTecnicaCondominioProps = {
	prospecto: ProspectoCondominio
}

export default function InformacionTecnicaCondominio({
	prospecto,
}: InformacionTecnicaCondominioProps) {
	return (
		<CardContent className='p-4 space-y-2.5'>
			<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				<DataItemProspecto
					icon={Ruler}
					label='Administrador asociado'
					value={prospecto.administrador?.nombre_administrador}
					missing={inputPendiente(
						prospecto.administrador?.nombre_administrador,
					)}
				/>

				<DataItemProspecto
					icon={Ruler}
					label='Uso del condominio'
					value={prospecto.uso_del_condominio}
					missing={inputPendiente(prospecto.uso_del_condominio)}
				/>

				<DataItemProspecto
					icon={Calendar}
					label='Año construcción'
					value={prospecto.year_construccion}
					missing={inputPendiente(prospecto.year_construccion)}
				/>

				<DataItemProspecto
					icon={Ruler}
					label='Materialidad'
					value={
						prospecto.materialidad
							? MATERIALIDAD_PRINCIPAL_LABELS[prospecto.materialidad]
							: undefined
					}
					missing={inputPendiente(prospecto.materialidad)}
				/>

				<DataItemProspecto
					icon={Flame}
					label='Clasificación preliminar incendio'
					value={
						prospecto.clasificacion_preliminar_incendio
							? CLASIFICACION_PRELIMINAR_INCENDIO_LABELS[
									prospecto.clasificacion_preliminar_incendio
								]
							: undefined
					}
					missing={inputPendiente(prospecto.clasificacion_preliminar_incendio)}
				/>

				<DataItemProspecto
					icon={Calendar}
					label='Cuenta con locales comerciales'
					value={prospecto.tiene_locales_comerciales}
					missing={inputPendiente(prospecto.tiene_locales_comerciales)}
				/>

				<DataItemProspecto
					icon={Calendar}
					label='Procesos productivos'
					value={prospecto.procesos_productivos}
					missing={inputPendiente(prospecto.procesos_productivos)}
				/>

				<DataItemProspecto
					icon={LayoutGrid}
					label='Total m² construidos'
					value={prospecto.metros_cuadrados?.toLocaleString('es-CL')}
					missing={inputPendiente(prospecto.metros_cuadrados)}
				/>

				<DataItemProspecto
					icon={Layers}
					label='Número de pisos'
					value={prospecto.numero_pisos}
					missing={inputPendiente(prospecto.numero_pisos)}
				/>

				<DataItemProspecto
					icon={Building2}
					label='Número de torres'
					value={prospecto.numero_torres}
					missing={inputPendiente(prospecto.numero_torres)}
				/>

				<DataItemProspecto
					icon={Home}
					label='Cantidad de departamentos'
					value={prospecto.cantidad_departamentos}
					missing={inputPendiente(prospecto.cantidad_departamentos)}
				/>

				<DataItemProspecto
					icon={MapPin}
					label='Cantidad de subterráneos'
					value={prospecto.cantidad_subterraneos}
					missing={inputPendiente(prospecto.cantidad_subterraneos)}
				/>

				<DataItemProspecto
					icon={Waves}
					label='Piscina'
					value={
						prospecto.tiene_piscina
							? prospecto.ubicacion_piscina
								? UBICACION_PISCINA_LABELS[prospecto.ubicacion_piscina]
								: 'Sí'
							: prospecto.tiene_piscina === false
								? 'No'
								: undefined
					}
					missing={inputPendiente(prospecto.tiene_piscina)}
				/>

				<DataItemProspecto
					icon={FireExtinguisher}
					label='Alarma incendio'
					value={prospecto.tiene_alarma_incendio}
					missing={inputPendiente(prospecto.tiene_alarma_incendio)}
				/>

				<DataItemProspecto
					icon={Shield}
					label='Sprinklers'
					value={prospecto.tiene_sprinklers}
					missing={inputPendiente(prospecto.tiene_sprinklers)}
				/>
			</div>

			<div className='col-span-full border-t border-border/60' />

			<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				<DataItemProspecto
					icon={LayoutGrid}
					label='Total m² construidos'
					value={prospecto.metros_cuadrados?.toLocaleString('es-CL')}
					missing={inputPendiente(prospecto.metros_cuadrados)}
				/>

				<DataItemProspecto
					icon={Shield}
					label='Valor UF / m² (sin IVA)'
					value={prospecto.uf_por_metro_cuadrado}
					missing={inputPendiente(prospecto.uf_por_metro_cuadrado)}
					badge={prospecto.valor_uf_m2_personalizado != null ? 'Personalizado' : undefined}
				/>

				<DataItemProspecto
					icon={Shield}
					label='Porcentaje de depreciación'
					value={
						prospecto.porcentaje_depreciacion != undefined
							? `${prospecto.porcentaje_depreciacion * 100}%`
							: null
					}
					missing={inputPendiente(prospecto.porcentaje_depreciacion)}
				/>

				<DataItemProspecto
					icon={Shield}
					label='Porcentaje de espacios comunes'
					value={
						prospecto.porcentaje_espacios_comunes != undefined
							? `${prospecto.porcentaje_espacios_comunes * 100}%`
							: null
					}
					missing={inputPendiente(prospecto.porcentaje_espacios_comunes)}
				/>

				<DataItemProspecto
					icon={DollarSign}
					label='Valor de reconstrucción'
					value={
						prospecto.valor_reconstruccion
							? formatUF(prospecto.valor_reconstruccion)
							: '—'
					}
				/>

				<DataItemProspecto
					icon={DollarSign}
					label='Reconstrucción con depreciación'
					value={
						prospecto.valor_reconstruccion_depreciacion
							? formatUF(prospecto.valor_reconstruccion_depreciacion)
							: '—'
					}
				/>

				<DataItemProspecto
					icon={DollarSign}
					label='Reconstrucción de espacios comunes'
					value={
						prospecto.valor_reconstruccion_espacio_comun
							? formatUF(prospecto.valor_reconstruccion_espacio_comun)
							: '—'
					}
				/>

				<DataItemProspecto
					icon={DollarSign}
					label='Reconstrucción de unidades'
					value={
						prospecto.valor_reconstruccion_unidades
							? formatUF(prospecto.valor_reconstruccion_unidades)
							: '—'
					}
				/>
			</div>
		</CardContent>
	)
}
