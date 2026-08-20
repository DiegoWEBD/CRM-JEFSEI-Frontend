'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import {
	CHILE_REGIONES_NOMBRES,
	obtenerComunasDeRegion,
} from '@/lib/chile-regiones-comunas'
import { useMemo } from 'react'

type FiltroRegionComunaProps = {
	region: string
	comuna: string
	onRegionChange: (region: string) => void
	onComunaChange: (comuna: string) => void
}

export default function FiltroRegionComuna({
	region,
	comuna,
	onRegionChange,
	onComunaChange,
}: FiltroRegionComunaProps) {
	const comunasDeRegion = useMemo(
		() => [...obtenerComunasDeRegion(region)],
		[region],
	)

	return (
		<div className='flex flex-1 flex-col gap-2 sm:flex-row'>
			<div className='flex-1 space-y-1.5'>
				<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
					Región
				</p>
				<Select
					value={region || '__all__'}
					onValueChange={v => {
						const r = v === '__all__' ? '' : v
						onRegionChange(r)
						if (comuna && !obtenerComunasDeRegion(r).includes(comuna)) {
							onComunaChange('')
						}
					}}
				>
					<SelectTrigger className='h-9 w-full text-xs shadow-none'>
						<SelectValue placeholder='Todas las regiones' />
					</SelectTrigger>
					<SelectContent className='max-h-70'>
						<SelectItem value='__all__' className='text-xs text-muted-foreground'>
							Todas las regiones
						</SelectItem>
						{CHILE_REGIONES_NOMBRES.map(r => (
							<SelectItem key={r} value={r} className='text-xs'>
								{r}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className='flex-1 space-y-1.5'>
				<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
					Comuna
				</p>
				<Select
					disabled={!region}
					value={comuna && comunasDeRegion.includes(comuna) ? comuna : '__all__'}
					onValueChange={v => onComunaChange(v === '__all__' ? '' : v)}
				>
					<SelectTrigger className='h-9 w-full text-xs shadow-none'>
						<SelectValue placeholder={region ? 'Todas las comunas' : 'Selecciona región'} />
					</SelectTrigger>
					<SelectContent className='max-h-70'>
						<SelectItem value='__all__' className='text-xs text-muted-foreground'>
							{region ? 'Todas las comunas' : 'Selecciona una región'}
						</SelectItem>
						{comunasDeRegion.map(c => (
							<SelectItem key={c} value={c} className='text-xs'>
								{c}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
