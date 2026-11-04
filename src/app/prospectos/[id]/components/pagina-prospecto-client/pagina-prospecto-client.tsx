'use client'

import AuthGuard from '@/components/layouts/guards/auth-guard'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { ProspectoEmpresa } from '@/dominio/prospecto-empresa/prospecto-empresa'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import {
	CODIGO_LINEA_CONDOMINIOS,
	CODIGO_LINEAS_COMERCIALES,
	codigoLineaNegocio,
} from '@/lib/linea-negocio'
import { useObtenerProspecto } from '@/hooks/prospectos/use-obtener-prospecto'
import CardArchivos from '../card-archivos/card-archivos'
import CardContactos from '../card-contactos/card-contactos'
import CardInformacionEmpresa from '../card-informacion-empresa/card-informacion-empresa'
import CardInformacionProspecto from '../card-informacion-prospecto/card-informacion-prospecto'
import CardInformacionTecnicaCondominio from '../card-informacion-tecnica-condominio/card-informacion-tecnica-condominio'
import CardOportunidadesComerciales from '../card-oportunidades-comerciales/card-oportunidades-comerciales'
import CardPolizas from '../card-polizas/card-polizas'
import EjecutivosAsignadosCard from '../ejecutivos-asignados-card/ejecutivos-asignados-card'
import ObservacionesComercialesSection from '../observaciones-comerciales-section'
import ProspectoHeroHeader from '../prospecto-hero-header/prospecto-hero-header'
import RecordatoriosClienteSection from '../recordatorios-cliente-section/recordatorios-cliente-section'
import SeguimientoComercialSection from '../seguimiento-comercial-section/seguimiento-comercial-section'
import PanelBody from '@/components/paneles/panel-layout/panel-body/panel-body'

type PaginaProspectoClientProps = {
	prospectoInicial: Prospecto
}

export default function PaginaProspectoClient({
	prospectoInicial,
}: PaginaProspectoClientProps) {
	const { data: prospecto } = useObtenerProspecto(prospectoInicial)

	const codigoLinea = codigoLineaNegocio(prospecto.linea_negocio)
	const esCondominio = codigoLinea === CODIGO_LINEA_CONDOMINIOS
	const esEmpresa = codigoLinea === CODIGO_LINEAS_COMERCIALES

	return (
		<PanelLayout>
			<ProspectoHeroHeader prospecto={prospecto} />

			<EjecutivosAsignadosCard prospecto={prospecto} />
			<CardInformacionProspecto prospecto={prospecto} />
			{esCondominio && (
				<CardInformacionTecnicaCondominio
					prospecto={prospecto as ProspectoCondominio}
				/>
			)}
			{esEmpresa && (
				<CardInformacionEmpresa prospecto={prospecto as ProspectoEmpresa} />
			)}

			<PanelBody className='lg:grid-cols-2'>
				<PermissionGuard
					allowedPermissions={[
						'OBTENER_CONTACTOS_PROPIOS',
						'OBTENER_CONTACTOS_TODOS',
					]}
				>
					<CardContactos idProspecto={prospecto.id} />
				</PermissionGuard>

				<AuthGuard>
					<CardArchivos idProspecto={prospecto.id} />
				</AuthGuard>
			</PanelBody>

			<PermissionGuard
				allowedPermissions={[
					'ADMINISTRAR_PROCESOS_COMERCIALES_PROPIOS',
					'ADMINISTRAR_PROCESOS_COMERCIALES',
				]}
			>
				<CardOportunidadesComerciales
					idProspecto={prospecto.id}
					idCliente={prospecto.id_cliente}
					informacionCompleta={prospecto.informacion_completa}
					nombreCliente={prospecto.nombre_riesgo}
					lineaNegocioId={prospecto.linea_negocio.id}
					lineaNegocioNombre={prospecto.linea_negocio.nombre}
					ejecutivoComercialRut={prospecto.ejecutivo_comercial_asignado?.rut}
					ejecutivoEvaluacionRut={prospecto.ejecutivo_evaluacion_asignado?.rut}
					ejecutivoRenovacionRut={prospecto.ejecutivo_renovacion_asignado?.rut}
				/>
			</PermissionGuard>

			<CardPolizas idCliente={prospecto.id_cliente} />

			<SeguimientoComercialSection
				idProspecto={prospecto.id}
				nombreCliente={prospecto.nombre_riesgo}
			/>
			<div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
				<RecordatoriosClienteSection
					idProspecto={prospecto.id}
					nombreCliente={prospecto.nombre_riesgo}
				/>
				<ObservacionesComercialesSection
					observaciones={prospecto.observaciones}
				/>
			</div>
		</PanelLayout>
	)
}
