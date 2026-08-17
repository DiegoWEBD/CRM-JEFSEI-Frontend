'use client'

import InicialesUsuario from '@/app/personal/components/iniciales-usuario'
import { Button } from '@/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/dropdown-menu'
import { useAuth } from '@/hooks/auth/use-auth'
import { ChevronDown, Loader2, LogOut, Settings, User } from 'lucide-react'

type Props = {
	nombre: string
	nombreRoles: string[]
}

const HeaderUsuario = ({ nombre, nombreRoles }: Props) => {
	const { logout, cargando } = useAuth()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='gap-2 px-1.5 py-1 sm:px-2' aria-label='Menú de usuario'>
					<div className='grid size-8 place-items-center rounded-full bg-primary/10 ring-1 ring-border'>
						<InicialesUsuario nombre={nombre} className='text-sm font-medium text-primary' />
					</div>
					<span className='hidden min-w-0 flex-col items-start leading-tight md:flex'>
						<span className='max-w-[12rem] truncate text-sm font-medium text-foreground'>{nombre}</span>
						<span className='max-w-[12rem] truncate text-sm text-muted-foreground'>
							{nombreRoles.join(', ')}
						</span>
					</span>
					<ChevronDown className='size-3.5 shrink-0 text-muted-foreground' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-56'>
				<DropdownMenuLabel className='flex flex-col gap-0.5'>
					<span className='truncate text-sm font-semibold'>{nombre}</span>
					<span className='truncate text-sm font-normal text-muted-foreground'>
						{nombreRoles.join(', ')}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className='gap-2'>
					<User className='size-4' />
					Perfil
				</DropdownMenuItem>
				<DropdownMenuItem className='gap-2'>
					<Settings className='size-4' />
					Configuración
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={cargando ? undefined : logout}
					disabled={cargando}
					className='gap-2 text-destructive hover:cursor-pointer hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive'
				>
					{cargando ? <Loader2 className='size-4 animate-spin' /> : <LogOut className='size-4' />}
					Cerrar sesión
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default HeaderUsuario