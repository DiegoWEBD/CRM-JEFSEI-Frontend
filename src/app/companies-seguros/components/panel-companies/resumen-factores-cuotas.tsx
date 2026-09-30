'use client'

import { FactorCuotasCompanyJson } from '@/aplicacion/companies-seguros/dto/factor-cuotas-company-json'
import { Badge } from '@/components/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'

/**
 * Ancho reservado para el chip "+N" (min-w-10) más el gap-1 que lo separa de
 * los badges. Se resta del ancho disponible antes de calcular cuántos caben.
 */
const ANCHO_CHIP = 40
const GAP = 4

/** En SSR useLayoutEffect no existe: se degrada a useEffect. */
const useLayoutEffectIso =
	typeof window === 'undefined' ? useEffect : useLayoutEffect

const BADGE_CLASS = 'px-1.5 py-0.5 text-[11px] gap-0.5'

type ResumenFactoresCuotasProps = {
	factores: FactorCuotasCompanyJson[]
	/** true = una sola línea, truncada con "+N" y tooltip (tabla desktop). */
	compacto?: boolean
}

function firmaDe(factores: FactorCuotasCompanyJson[]) {
	return factores.map(f => `${f.numero_cuotas}:${f.factor}`).join('|')
}

/**
 * Muestra el conteo de factores y la lista de `n · factor`.
 *
 * En modo compacto los badges van en una sola línea: se renderizan todos y,
 * antes del pintado, se recortan a los que caben en el ancho de la celda. El
 * resto queda en el chip "+N", cuyo tooltip lista los factores completos.
 */
export default function ResumenFactoresCuotas({
	factores,
	compacto = false,
}: ResumenFactoresCuotasProps) {
	const [visibles, setVisibles] = useState(factores.length)
	const contenedorRef = useRef<HTMLDivElement>(null)
	const badgesRef = useRef<Array<HTMLSpanElement | null>>([])
	const anchosRef = useRef<number[]>([])
	const firmaRef = useRef('')

	const firma = firmaDe(factores)

	const medir = useCallback(() => {
		const contenedor = contenedorRef.current
		if (!contenedor || !compacto || factores.length === 0) return

		// Celda sin layout (por ejemplo, la tabla está oculta en móvil):
		// todavía no hay nada que medir.
		if (contenedor.clientWidth === 0) return

		const faltaMedir =
			firmaRef.current !== firma || anchosRef.current.length !== factores.length

		if (faltaMedir) {
			// Sin los anchos (primer render o factores actualizados) hay que
			// dejar todos visibles para poder medirlos desde el DOM.
			if (visibles !== factores.length) {
				setVisibles(factores.length)
				return
			}

			const anchos: number[] = []
			for (let i = 0; i < factores.length; i++) {
				anchos.push(badgesRef.current[i]?.offsetWidth ?? 0)
			}

			// Algún badge sin medir: se reintenta en el próximo disparo.
			if (anchos.some(ancho => ancho === 0)) return

			anchosRef.current = anchos
			firmaRef.current = firma
		}

		const disponible = contenedor.clientWidth - ANCHO_CHIP - GAP
		let acumulado = 0
		let caben = 0

		for (const ancho of anchosRef.current) {
			const anchoTotal = ancho + GAP
			if (acumulado + anchoTotal > disponible) break
			acumulado += anchoTotal
			caben++
		}

		if (caben !== visibles) setVisibles(caben)
	}, [compacto, firma, factores.length, visibles])

	// Antes del pintado: la primera medición no llega a verse a medias.
	useLayoutEffectIso(medir, [medir])

	// Al redimensionar la celda se recalcula con los anchos ya guardados.
	useEffect(() => {
		const contenedor = contenedorRef.current
		if (!contenedor || typeof ResizeObserver === 'undefined') return

		const observador = new ResizeObserver(medir)
		observador.observe(contenedor)
		return () => observador.disconnect()
	}, [medir])

	if (factores.length === 0) {
		return <span className='text-xs text-muted-foreground'>Sin factores</span>
	}

	if (!compacto) {
		return (
			<div className='flex flex-wrap items-center gap-1'>
				{factores.map(factor => (
					<Badge
						key={factor.numero_cuotas}
						variant='pastel-blue'
						className={BADGE_CLASS}
					>
						{factor.numero_cuotas} · {factor.factor}
					</Badge>
				))}
			</div>
		)
	}

	const ocultos = factores.length - Math.min(visibles, factores.length)

	return (
		<div className='flex items-center gap-1'>
			<div
				ref={contenedorRef}
				className='flex min-w-0 flex-1 flex-nowrap items-center gap-1 overflow-hidden'
			>
				{factores.slice(0, visibles).map((factor, indice) => (
					<Badge
						key={factor.numero_cuotas}
						ref={elemento => {
							badgesRef.current[indice] = elemento
						}}
						variant='pastel-blue'
						className={BADGE_CLASS}
					>
						{factor.numero_cuotas} · {factor.factor}
					</Badge>
				))}
			</div>

			{ocultos > 0 && (
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type='button'
							className='inline-flex h-5 min-w-10 shrink-0 items-center justify-center rounded-md bg-muted px-1 text-[11px] font-medium tabular-nums text-muted-foreground hover:bg-muted/70'
						>
							+{ocultos}
						</button>
					</TooltipTrigger>
					<TooltipContent side='top' sideOffset={6} className='max-w-64'>
						<div className='flex flex-col gap-0.5 text-left'>
							<span className='font-medium'>Factores de cuotas</span>
							{factores.map(factor => (
								<span key={factor.numero_cuotas}>
									{factor.numero_cuotas} cuotas → {factor.factor}
								</span>
							))}
						</div>
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	)
}
