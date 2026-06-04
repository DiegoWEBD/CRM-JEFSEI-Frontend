import CardContent from '@/components/card/card-content/card-content'
import EvaluacionRiesgo from '@/dominio/evaluacion-riesgo/evaluacion-riesgo'
import { inputPendiente } from '@/utils/input/input-pendiente'
import ItemInformacionProspecto from '../../card-informacion-prospecto/item-informacion-prospecto/item-informacion-prospecto'

type InformacionTecnicaCondominioProps = {
	evaluacionRiesgo?: EvaluacionRiesgo
}

export default function InformacionTecnicaCondominio({
	evaluacionRiesgo,
}: InformacionTecnicaCondominioProps) {
	return (
		<CardContent className='grid gap-x-6 gap-y-3 p-4 sm:grid-cols-2 lg:grid-cols-3'>
			<ItemInformacionProspecto
				label='Valor UF/m²'
				value={evaluacionRiesgo?.uf_por_metro_cuadrado}
				highlightMissing={inputPendiente(
					evaluacionRiesgo?.uf_por_metro_cuadrado,
				)}
				className='sm:col-span-2 lg:col-span-3'
			/>
			<ItemInformacionProspecto
				label='Porcentaje de depreciación'
				value={
					evaluacionRiesgo?.porcentaje_depreciacion
						? `${evaluacionRiesgo.porcentaje_depreciacion * 100}%`
						: undefined
				}
				highlightMissing={inputPendiente(
					evaluacionRiesgo?.porcentaje_depreciacion,
				)}
			/>

			<ItemInformacionProspecto
				label='Porcentaje de espacios comunes'
				value={
					evaluacionRiesgo?.porcentaje_espacios_comunes
						? `${evaluacionRiesgo.porcentaje_espacios_comunes * 100}%`
						: undefined
				}
				highlightMissing={inputPendiente(
					evaluacionRiesgo?.porcentaje_espacios_comunes,
				)}
			/>
		</CardContent>
	)
}
