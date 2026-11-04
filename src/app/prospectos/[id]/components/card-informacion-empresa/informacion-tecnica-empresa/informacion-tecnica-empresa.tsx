import { CardContent } from '@/components/card'
import { ProspectoEmpresa } from '@/dominio/prospecto-empresa/prospecto-empresa'
import { inputPendiente } from '@/utils/input/input-pendiente'
import { Ruler } from 'lucide-react'
import DataItemProspecto from '../../card-informacion-tecnica-condominio/informacion-tecnica-condominio/data-item-prospecto/data-item-prospecto'

type InformacionTecnicaEmpresaProps = {
	prospecto: ProspectoEmpresa
}

export default function InformacionTecnicaEmpresa({
	prospecto,
}: InformacionTecnicaEmpresaProps) {
	return (
		<CardContent className='p-4 space-y-2.5'>
			<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				<DataItemProspecto
					icon={Ruler}
					label='Nombre de fantasía'
					value={prospecto.nombre_fantasia}
					missing={inputPendiente(prospecto.nombre_fantasia)}
				/>

				<DataItemProspecto
					icon={Ruler}
					label='Cantidad de trabajadores'
					value={prospecto.cantidad_trabajadores}
					missing={inputPendiente(prospecto.cantidad_trabajadores)}
				/>
			</div>

			<div className='space-y-2.5 sm:col-span-2'>
				<div className='text-xs font-medium text-muted-foreground'>
					Giros comerciales
				</div>

				<div className='grid grid-cols-1 gap-2.5'>
					{prospecto.giros_comerciales.length === 0 && (
						<p className='text-xs text-muted-foreground'>
							Sin giros comerciales registrados.
						</p>
					)}

					{prospecto.giros_comerciales.map((giro, indice) => (
						<DataItemProspecto
							key={indice}
							icon={Ruler}
							label='Giro comercial'
							value={giro}
						/>
					))}
				</div>
			</div>
		</CardContent>
	)
}
