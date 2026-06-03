import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import ItemInformacionProspecto from '../../item-informacion-prospecto/item-informacion-prospecto'
import { inputPendiente } from '@/utils/input/input-pendiente'
import { normalizarNumeroFormatoChileno } from '@/utils/normalizar-numero-formato-chileno'

type InformacionAdicionalProspectoCondominioProps = {
	prospecto: ProspectoCondominio
}

export default function InformacionAdicionalProspectoCondominio({
	prospecto,
}: InformacionAdicionalProspectoCondominioProps) {
	return (
		<>
			<ItemInformacionProspecto
				label='Cuenta con locales comerciales'
				value={prospecto.tiene_locales_comerciales}
				highlightMissing={inputPendiente(prospecto.tiene_locales_comerciales)}
			/>
			<ItemInformacionProspecto
				label='Cuenta con piscina'
				value={prospecto.tiene_piscina}
				highlightMissing={inputPendiente(prospecto.tiene_piscina)}
			/>
			<ItemInformacionProspecto
				label='Uso del condominio'
				value={prospecto.uso_del_condominio}
				highlightMissing={inputPendiente(prospecto.uso_del_condominio)}
			/>
			<ItemInformacionProspecto
				label='Número de pisos'
				value={prospecto.numero_pisos}
				highlightMissing={inputPendiente(prospecto.numero_pisos)}
			/>
			<ItemInformacionProspecto
				label='Número de torres'
				value={prospecto.numero_torres}
				highlightMissing={inputPendiente(prospecto.numero_torres)}
			/>
			<ItemInformacionProspecto
				label='Número de departamentos'
				value={prospecto.cantidad_departamentos}
				highlightMissing={inputPendiente(prospecto.cantidad_departamentos)}
			/>
			<ItemInformacionProspecto
				label='Número de subterráneos'
				value={prospecto.cantidad_subterraneos}
				highlightMissing={inputPendiente(prospecto.cantidad_subterraneos)}
			/>
			<ItemInformacionProspecto
				label='Año de construcción'
				value={prospecto.year_construccion}
				highlightMissing={inputPendiente(prospecto.year_construccion)}
			/>
			<ItemInformacionProspecto
				label='Metros cuadrados construidos'
				value={
					prospecto.metros_cuadrados
						? normalizarNumeroFormatoChileno(prospecto.metros_cuadrados)
						: prospecto.metros_cuadrados
				}
				highlightMissing={inputPendiente(prospecto.metros_cuadrados)}
			/>
			<ItemInformacionProspecto
				label='Administrador desea ser contactado'
				value={prospecto.desea_ser_contactado}
			/>
		</>
	)
}
