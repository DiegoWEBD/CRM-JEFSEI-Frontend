import type { EstadoComercialProspecto } from '@/types/estados/estado-comercial-cliente'
import type { BadgeVariant } from '@/lib/badge-variants'
import { ESTADO_COMERCIAL_VARIANT } from '@/lib/badge-variants'

export const ESTADO_COMERCIAL_BADGE: Record<EstadoComercialProspecto, BadgeVariant> =
	ESTADO_COMERCIAL_VARIANT
