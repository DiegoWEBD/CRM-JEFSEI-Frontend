'use client'

import { useQueryPolizas } from '@/hooks/polizas/use-query-polizas'

type CardPolizasProps = {
	idCliente?: number
}

export default function CardPolizas({ idCliente }: CardPolizasProps) {
	const { data: polizas } = useQueryPolizas(idCliente)

	console.log(polizas)

	return <></>
}
