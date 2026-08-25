'use client'

import { ObtenerAdministradoresResponse } from '@/aplicacion/administradores/use-cases/obtener-administradores/dto/obtener-administradores-response'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import { Input } from '@/components/input'
import Paginacion from '@/components/paginacion/paginacion'
import { useAdministradores } from '@/hooks/administradores/use-administradores'
import { useDebounce } from '@/hooks/use-debounce'
import { Building2, Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import { DialogoRegistrarAdministrador } from '@/components/dialogo-registrar-administrador'
import CardAdministrador from './card-administrador'
import SkeletonCardsAdministrador from './skeleton-cards-administrador'
import { useQueryClient } from '@tanstack/react-query'

const TAMANO_PAGINA = 10

type AdministradoresClientProps = {
	initialData: ObtenerAdministradoresResponse
}

export default function AdministradoresClient({
	initialData,
}: AdministradoresClientProps) {
	const [pagina, setPagina] = useState(1)
	const [inputValue, setInputValue] = useState('')
	const [dialogoAbierto, setDialogoAbierto] = useState(false)
	const textoBusqueda = useDebounce(inputValue, 300)
	const queryClient = useQueryClient()

	const { data, isFetching } = useAdministradores(
		initialData,
		textoBusqueda,
		pagina,
		TAMANO_PAGINA,
	)

	const response = data ?? initialData

	const esConsultaInicial =
		textoBusqueda === '' && pagina === 1
	const buscandoEnDebounce = inputValue !== textoBusqueda
	const mostrandoEsqueleto = isFetching && !esConsultaInicial

	const onBusquedaChange = (valor: string) => {
		setInputValue(valor)
		setPagina(1)
	}

	const onAdministradorRegistrado = () => {
		queryClient.invalidateQueries({ queryKey: ['administradores'] })
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between gap-3'>
				<div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
					<Building2 className='size-4' />
					<span>
						{response.total} administrador
						{response.total !== 1 ? 'es' : ''}
					</span>
				</div>
				<Button
					size='sm'
					className='h-9 text-xs'
					onClick={() => setDialogoAbierto(true)}
				>
					<Plus className='mr-1.5 size-3.5' />
					Registrar administrador
				</Button>
			</div>

			<div className='relative'>
				<Search className='absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
				<Input
					placeholder='Buscar por nombre, contacto o correo...'
					className='h-9 pr-9 pl-9 text-sm shadow-none'
					value={inputValue}
					onChange={(e) => onBusquedaChange(e.target.value)}
				/>
				{inputValue && (
					<Button
						type='button'
						variant='ghost'
						className='absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground'
						onClick={() => onBusquedaChange('')}
						aria-label='Limpiar búsqueda'
					>
						<X className='h-3.5 w-3.5' />
					</Button>
				)}
			</div>

			<div className='space-y-2'>
				<div className='relative'>
					{buscandoEnDebounce && !isFetching && (
						<div className='pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse bg-primary/50' />
					)}
					{mostrandoEsqueleto ? (
						<SkeletonCardsAdministrador />
					) : response.data.length === 0 ? (
						<Card>
							<CardContent className='flex flex-col items-center gap-2 py-12'>
								<Building2 className='size-10 text-muted-foreground/40' />
								<p className='text-sm text-muted-foreground'>
									{textoBusqueda.trim()
										? 'No se encontraron administradores que coincidan con la búsqueda.'
										: 'No hay administradores registrados.'}
								</p>
							</CardContent>
						</Card>
					) : (
						<div className='grid gap-4 sm:grid-cols-2'>
							{response.data.map((administrador) => (
								<CardAdministrador
									key={administrador.id}
									administrador={administrador}
									textoBusqueda={textoBusqueda}
								/>
							))}
						</div>
					)}
				</div>
				<Paginacion
					pagina={response.pagina}
					totalPaginas={response.total_paginas}
					onPaginaChange={setPagina}
				/>
			</div>

			<DialogoRegistrarAdministrador
				open={dialogoAbierto}
				onOpenChange={setDialogoAbierto}
				onAdministradorCreado={onAdministradorRegistrado}
			/>
		</div>
	)
}
