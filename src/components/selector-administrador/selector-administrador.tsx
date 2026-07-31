'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { Button } from '@/components/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/popover'
import { cn } from '@/lib/utils'
import type AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import { DialogoRegistrarAdministrador } from '@/components/dialogo-registrar-administrador'

type SelectorAdministradorProps = {
	value: number | undefined
	onChange: (id: number | undefined) => void
	administradores: AdministradorCondominio[]
}

export default function SelectorAdministrador({
	value,
	onChange,
	administradores,
}: SelectorAdministradorProps) {
	const [abierto, setAbierto] = useState(false)
	const [busqueda, setBusqueda] = useState('')
	const [dialogoAbierto, setDialogoAbierto] = useState(false)

	const seleccionado = useMemo(
		() => administradores.find(a => a.id === value),
		[administradores, value],
	)

	const filtrados = useMemo(
		() =>
			busqueda.trim().length === 0
				? administradores
				: administradores.filter(a =>
						a.nombre_administrador
							.toLowerCase()
							.includes(busqueda.toLowerCase()),
					),
		[administradores, busqueda],
	)

	const mostrarCrear = busqueda.trim().length > 0

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
				<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
					<Command shouldFilter={false}>
						<CommandInput
							placeholder='Buscar administrador...'
							value={busqueda}
							onValueChange={setBusqueda}
						/>
						<CommandList>
							<CommandGroup>
								<CommandItem
									value='__none__'
									onSelect={() => {
										onChange(undefined)
										setAbierto(false)
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === undefined ? 'opacity-100' : 'opacity-0',
										)}
									/>
									Sin administrador
								</CommandItem>
							</CommandGroup>
							{filtrados.length === 0 && !mostrarCrear && (
								<CommandEmpty>Sin resultados</CommandEmpty>
							)}
							{filtrados.length > 0 && (
								<CommandGroup>
									{filtrados.map(admin => (
										<CommandItem
											key={admin.id}
											value={admin.nombre_administrador}
											onSelect={() => {
												onChange(admin.id)
												setAbierto(false)
											}}
										>
											<Check
												className={cn(
													'mr-2 h-4 w-4',
													value === admin.id
														? 'opacity-100'
														: 'opacity-0',
												)}
											/>
											{admin.nombre_administrador}
										</CommandItem>
									))}
								</CommandGroup>
							)}
							{mostrarCrear && (
								<CommandGroup>
									<CommandItem
										value='__crear__'
										onSelect={() => {
											setDialogoAbierto(true)
										}}
									>
										<Plus className='mr-2 h-4 w-4' />
										Crear &ldquo;{busqueda}&rdquo;
									</CommandItem>
								</CommandGroup>
							)}
						</CommandList>
					</Command>
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
