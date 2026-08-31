'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { Check, ChevronsUpDown, Loader2, Plus, SearchIcon } from 'lucide-react'
import { Button } from '@/components/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover'
import { ScrollArea } from '@/components/scroll-area'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'
import { useAdministradoresInfinite } from '@/hooks/administradores/use-administradores-infinite'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { DialogoRegistrarAdministrador } from '@/components/dialogo-registrar-administrador'

type SelectorAdministradorProps = {
	value: number | undefined
	onChange: (id: number | undefined) => void
}

export default function SelectorAdministrador({
	value,
	onChange,
}: SelectorAdministradorProps) {
	const [abierto, setAbierto] = useState(false)
	const [busqueda, setBusqueda] = useState('')
	const [dialogoAbierto, setDialogoAbierto] = useState(false)

	const debouncedBusqueda = useDebounce(busqueda, 300)
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useAdministradoresInfinite(debouncedBusqueda)

	const administradores = useMemo(
		() => data?.pages.flatMap(page => page.data) ?? [],
		[data],
	)

	const seleccionado = useMemo(
		() => administradores.find(a => a.id === value),
		[administradores, value],
	)

	const mostrarCrear = busqueda.trim().length > 0

	const sentinelRef = useRef<HTMLDivElement>(null)
	const scrollAreaRef = useRef<HTMLDivElement>(null)

	const handleIntersect = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	useIntersectionObserver(sentinelRef, {
		onIntersect: handleIntersect,
		enabled: !!hasNextPage && !isFetchingNextPage,
		rootRef: scrollAreaRef,
		rootSelector: '[data-radix-scroll-area-viewport]',
	})

	const handleSelect = (id: number | undefined) => {
		onChange(id)
		setAbierto(false)
	}

	return (
		<>
			<Popover open={abierto} onOpenChange={setAbierto}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={abierto}
						className='h-9 w-full justify-between text-sm font-normal shadow-none'
					>
						{seleccionado?.nombre_administrador ?? (
							<span className='text-muted-foreground'>
								Seleccione administrador
							</span>
						)}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className='flex w-[--radix-popover-trigger-width] flex-col p-0'
					onOpenAutoFocus={e => e.preventDefault()}
				>
					<div className='flex items-center border-b px-3'>
						<SearchIcon className='size-4 shrink-0 opacity-50' />
						<input
							placeholder='Escriba para buscar...'
							value={busqueda}
							onChange={e => setBusqueda(e.target.value)}
							className='flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground'
						/>
					</div>

					<ScrollArea
						ref={scrollAreaRef}
						className='flex-1 max-h-75 overflow-y-auto'
					>
						<div className='p-1'>
							<button
								type='button'
								onClick={() => handleSelect(undefined)}
								className={cn(
									'relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground',
								)}
							>
								<Check
									className={cn(
										'mr-2 h-4 w-4',
										value === undefined ? 'opacity-100' : 'opacity-0',
									)}
								/>
								Sin administrador
							</button>

							{debouncedBusqueda.trim().length > 0 &&
								!isLoading &&
								administradores.length === 0 &&
								!mostrarCrear && (
									<p className='py-6 text-center text-sm text-muted-foreground'>
										Sin resultados
									</p>
								)}

							{administradores.map(admin => (
								<button
									type='button'
									key={admin.id}
									onClick={() => handleSelect(admin.id)}
									className={cn(
										'relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground',
									)}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === admin.id ? 'opacity-100' : 'opacity-0',
										)}
									/>
									{admin.nombre_administrador}
								</button>
							))}

							{hasNextPage && <div ref={sentinelRef} className='h-1' />}

							{isFetchingNextPage && (
								<div className='flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground'>
									<Loader2 className='h-4 w-4 animate-spin' />
									Cargando más...
								</div>
							)}

							{mostrarCrear && (
								<button
									type='button'
									onClick={() => setDialogoAbierto(true)}
									className={cn(
										'relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground',
									)}
								>
									<Plus className='mr-2 h-4 w-4' />
									Crear &ldquo;{busqueda}&rdquo;
								</button>
							)}
						</div>
					</ScrollArea>
				</PopoverContent>
			</Popover>

			<DialogoRegistrarAdministrador
				open={dialogoAbierto}
				onOpenChange={setDialogoAbierto}
				nombreSugerido={busqueda}
				onAdministradorCreado={admin => {
					onChange(admin.id)
					setDialogoAbierto(false)
					setAbierto(false)
				}}
			/>
		</>
	)
}
