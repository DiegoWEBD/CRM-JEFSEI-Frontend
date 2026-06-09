import CardContent from '@/components/card/card-content/card-content'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import { formatearFecha } from '@/utils/formatear-fecha'
import { inputPendiente } from '@/utils/input/input-pendiente'
import ItemInformacionProspecto from '../item-informacion-prospecto/item-informacion-prospecto'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'

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

			{prospecto.linea_negocio.nombre.toLowerCase() !== 'condominio' && (
				<ItemInformacionProspecto
					label='Teléfono de contacto'
					value={prospecto.telefono_contacto}
					highlightMissing={inputPendiente(prospecto.telefono_contacto)}
				/>
			)}

			{prospecto.linea_negocio.nombre.toLowerCase() === 'condominio' && (
				<ItemInformacionProspecto
					label='Contacto de administrador'
					value={(prospecto as ProspectoCondominio).administrador?.telefono}
					highlightMissing={inputPendiente(
						(prospecto as ProspectoCondominio).administrador?.telefono,
					)}
				/>
			)}

			<ItemInformacionProspecto
				label='Correo prospecto'
				value={prospecto.correo_contacto}
				highlightMissing={inputPendiente(prospecto.correo_contacto)}
			/>

			<ItemInformacionProspecto
				label='Registrado por'
				value={prospecto.registrado_por.nombre}
			/>

			<ItemInformacionProspecto
				label='Ejecutivo comercial asignado'
				value={prospecto.ejecutivo_comercial_asignado?.nombre ?? '—'}
			/>
			<ItemInformacionProspecto
				label='Última actualización'
				value={formatearFecha(
					new Date(prospecto.ultima_actualizacion),
					'dd-MM-yyy · HH:mm',
				)}
			/>
		</CardContent>
	)
}
