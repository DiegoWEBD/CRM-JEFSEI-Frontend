import { EstadoInformativoJson } from '@/aplicacion/procesos-comerciales/dto/estado-informativo-json'
import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { Badge } from '../badge'

type BadgeEstadoOportunidadProps = {
	estado: EstadoInformativoJson
}

export const BadgeEstadoOportunidad = ({
	estado,
}: BadgeEstadoOportunidadProps) => {
	return (
		<Badge
			variant={ESTADO_COMERCIAL_BADGE[estado.codigo]}
			className='shrink-0 py-1 px-2 text-xs leading-none'
		>
			{estado.nombre}
		</Badge>
	)
}
