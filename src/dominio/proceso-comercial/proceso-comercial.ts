import { EstadoComercialProspecto } from '@/types/estados/estado-comercial-cliente'

export interface ProcesoComercial {
	id: number
	ejecutivo_comercial: { rut: string; nombre: string } | null
	ejecutivo_evaluacion: { rut: string; nombre: string } | null
	id_prospecto: number
	nombre_cliente: string
	producto: string
	tipo_producto: string
	estado_actual: { codigo: EstadoComercialProspecto; nombre: string }
	etapa_actual: { id: number; nombre: string; dias_limite: number | null }
	cerrado: boolean
}
