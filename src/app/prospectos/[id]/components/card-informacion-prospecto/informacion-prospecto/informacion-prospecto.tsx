import CardContent from '@/components/card/card-content/card-content'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import { formatearFecha } from '@/utils/formatear-fecha'
import { inputPendiente } from '@/utils/input/input-pendiente'
import ItemInformacionProspecto from '../item-informacion-prospecto/item-informacion-prospecto'
import InformacionAdicionalProspectoCondominio from './informacion-adicional-prospecto-condominio/informacion-adicional-prospecto-condominio'

type InformacionProspectoProps = {
	prospecto: Prospecto
}

export default function InformacionProspecto({
	prospecto,
}: InformacionProspectoProps) {
	return (
		<CardContent className='grid gap-x-6 gap-y-3 p-4 sm:grid-cols-2 lg:grid-cols-3'>
			<ItemInformacionProspecto
				label='Nombre'
				value={prospecto.nombre_riesgo}
				highlightMissing={inputPendiente(prospecto.nombre_riesgo)}
				className='sm:col-span-2 lg:col-span-3'
			/>
			<ItemInformacionProspecto
				label='Rut'
				value={prospecto.rut_riesgo}
				highlightMissing={inputPendiente(prospecto.rut_riesgo)}
			/>
			<ItemInformacionProspecto
				label='Línea de negocio'
				value={prospecto.linea_negocio.nombre}
			/>
			<ItemInformacionProspecto
				label='Estado de información'
				value={
					prospecto.informacion_completa
						? 'Información completa'
						: 'Información incompleta'
				}
			/>
			<ItemInformacionProspecto
				label='Dirección'
				value={prospecto.direccion}
				highlightMissing={inputPendiente(prospecto.direccion)}
				className='sm:col-span-2 lg:col-span-3'
			/>
			<ItemInformacionProspecto
				label='Región'
				value={prospecto.region}
				highlightMissing={inputPendiente(prospecto.region)}
			/>
			<ItemInformacionProspecto label='Comuna' value={prospecto.comuna} />
			<ItemInformacionProspecto
				label='Teléfono'
				value={prospecto.telefono_contacto}
				highlightMissing={inputPendiente(prospecto.telefono_contacto)}
			/>
			<ItemInformacionProspecto
				label='Correo'
				value={prospecto.correo_contacto}
				highlightMissing={inputPendiente(prospecto.correo_contacto)}
			/>
			<ItemInformacionProspecto
				label='Contacto administrador/a'
				value={prospecto.telefono_contacto}
				highlightMissing={inputPendiente(prospecto.telefono_contacto)}
			/>
			<ItemInformacionProspecto
				label='Administrador asociado'
				value={prospecto.nombre_contacto}
				highlightMissing={inputPendiente(prospecto.nombre_contacto)}
			/>
			<ItemInformacionProspecto
				label='Ejecutivo comercial asignado'
				value={prospecto.proceso_comercial.ejecutivo_comercial?.nombre ?? '—'}
			/>
			<ItemInformacionProspecto
				label='Última actualización'
				value={formatearFecha(
					new Date(prospecto.ultima_actualizacion),
					'dd-MM-yyy · HH:mm',
				)}
			/>

			{prospecto.linea_negocio.nombre.toLowerCase() === 'condominio' && (
				<InformacionAdicionalProspectoCondominio
					prospecto={prospecto as ProspectoCondominio}
				/>
			)}
		</CardContent>
	)
}
