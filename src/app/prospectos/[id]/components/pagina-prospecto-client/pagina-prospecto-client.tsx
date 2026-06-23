'use client'

import EstadoCompletitudInformacion from '@/components/estado-completitud-informacion/estado-completitud-informacion'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import { useObtenerProspecto } from '@/hooks/prospectos/use-obtener-prospecto'
import { AlertTriangle } from 'lucide-react'
import CardInformacionProspecto from '../card-informacion-prospecto/card-informacion-prospecto'
import CardInformacionTecnicaCondominio from '../card-informacion-tecnica-condominio/card-informacion-tecnica-condominio'
import CardPolizas from '../card-polizas/card-polizas'
import CardOportunidadesComerciales from '../card-oportunidades-comerciales/card-oportunidades-comerciales'
import PaginaProspectoHeader from '../pagina-prospecto-header/pagina-prospecto-header'

type PaginaProspectoClientProps = {
	prospectoInicial: Prospecto
}

export default function PaginaProspectoClient({
	prospectoInicial,
}: PaginaProspectoClientProps) {
	const { data: prospecto } = useObtenerProspecto(prospectoInicial)

	return (
		<PanelLayout>
			<PanelHeader>
				<PaginaProspectoHeader prospecto={prospecto} />
			</PanelHeader>

			{!prospecto.informacion_completa && (
				<EstadoCompletitudInformacion
					completa={prospecto.informacion_completa}
					className='px-3 py-2.5 flex gap-2 w-full items-center justify-start'
				>
					<AlertTriangle
						className='mt-0.5 shrink-0 text-amber-600'
						aria-hidden
					/>
					<p className='font-medium'>
						Faltan datos obligatorios del prospecto.
					</p>
				</EstadoCompletitudInformacion>
			)}

			<CardInformacionProspecto prospecto={prospecto} />

			{prospecto.linea_negocio.nombre.toLowerCase() === 'condominio' && (
				<CardInformacionTecnicaCondominio
					prospecto={prospecto as ProspectoCondominio}
				/>
			)}

			<CardOportunidadesComerciales
				idProspecto={prospecto.id}
				informacionCompleta={prospecto.informacion_completa}
				nombreCliente={prospecto.nombre_riesgo}
				lineaNegocioNombre={prospecto.linea_negocio.nombre}
			/>

			<CardPolizas
				idCliente={prospecto.id_cliente}
				nombreCliente={prospecto.nombre_riesgo}
			/>
		</PanelLayout>
	)
}
