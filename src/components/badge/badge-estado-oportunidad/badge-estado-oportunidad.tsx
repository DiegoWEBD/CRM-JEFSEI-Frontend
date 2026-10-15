import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { Badge } from '../badge'
import { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'

type BadgeEstadoOportunidadProps = {
	oportunidad: ProcesoComercial
}

export const BadgeEstadoOportunidad = ({
	oportunidad,
}: BadgeEstadoOportunidadProps) => {
	return (
		<Badge
			variant={ESTADO_COMERCIAL_BADGE[oportunidad.estado_actual.codigo]}
			className='shrink-0 py-1 px-2 text-xs leading-none'
		>
			{oportunidad.estado_actual.nombre}
		</Badge>
	)
}
