'use client'

import InicialesUsuario from '@/app/personal/components/iniciales-usuario'
import { Button } from '@/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu'
import { useAuth } from '@/hooks/auth/use-auth'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'

type Props = {
	nombre: string
}

const HeaderUsuario = ({ nombre }: Props) => {
	const { logout } = useAuth()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='gap-1.5 px-2 sm:gap-2 sm:px-3'>
					<div className='h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center'>
						<InicialesUsuario nombre={nombre} className='text-primary ' />
					</div>
					<span className='text-sm hidden md:inline-block'>{nombre}</span>

					<ChevronDown className='h-3 w-3 text-muted-foreground' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-48'>
				<DropdownMenuItem>
					<User className='h-4 w-4 mr-2' />
					Perfil
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings className='h-4 w-4 mr-2' />
					Configuracion
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={logout}
					className='text-destructive hover:cursor-pointer'
				>
					<LogOut className='h-4 w-4 mr-2' />
					Cerrar sesion
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default HeaderUsuario
