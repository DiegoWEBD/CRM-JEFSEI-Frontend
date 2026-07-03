import { CardContent } from '@/components/card'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { inputPendiente } from '@/utils/input/input-pendiente'
import InformacionAdicionalProspectoCondominio from '../../card-informacion-prospecto/informacion-prospecto/informacion-adicional-prospecto-condominio/informacion-adicional-prospecto-condominio'
import ItemInformacionProspecto from '../../card-informacion-prospecto/item-informacion-prospecto/item-informacion-prospecto'

type InformacionTecnicaCondominioProps = {
	prospecto: ProspectoCondominio
}

export default function InformacionTecnicaCondominio({
	prospecto,
}: InformacionTecnicaCondominioProps) {
	return (
		<CardContent className='grid gap-x-6 gap-y-3 p-4 sm:grid-cols-2 lg:grid-cols-3'>
			<ItemInformacionProspecto
				label='Administrador asociado'
				value={prospecto.administrador?.nombre_administrador}
				highlightMissing={inputPendiente(
					prospecto.administrador?.nombre_administrador,
				)}
			/>
			{prospecto.linea_negocio.nombre.toLowerCase() === 'condominio' && (
				<InformacionAdicionalProspectoCondominio
					prospecto={prospecto as ProspectoCondominio}
				/>
			)}
			<ItemInformacionProspecto
				label='Valor UF/m²'
				value={prospecto.uf_por_metro_cuadrado}
				highlightMissing={inputPendiente(prospecto.uf_por_metro_cuadrado)}
			/>
			<ItemInformacionProspecto
				label='Porcentaje de depreciación'
				value={
					prospecto.porcentaje_depreciacion != null
						? `${prospecto.porcentaje_depreciacion * 100}%`
						: undefined
				}
				highlightMissing={inputPendiente(prospecto.porcentaje_depreciacion)}
			/>

			<ItemInformacionProspecto
				label='Porcentaje de espacios comunes'
				value={
					prospecto.porcentaje_espacios_comunes != null
						? `${prospecto.porcentaje_espacios_comunes * 100}%`
						: undefined
				}
				highlightMissing={inputPendiente(prospecto.porcentaje_espacios_comunes)}
			/>
		</CardContent>
	)
}
