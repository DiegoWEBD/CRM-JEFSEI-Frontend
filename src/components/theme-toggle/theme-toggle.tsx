'use client'

import { useTheme } from 'next-themes'
import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/dropdown-menu'

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon-sm'
					aria-label='Cambiar tema'
					title='Cambiar tema'
					className='relative text-muted-foreground'
				>
					<Sun className='size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
					<Moon className='absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-40'>
				<DropdownMenuItem onClick={() => setTheme('light')} className='gap-2'>
					<Sun className='size-4' />
					<span className='flex-1'>Claro</span>
					{theme === 'light' && <span className='size-1.5 rounded-full bg-primary' aria-hidden='true' />}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')} className='gap-2'>
					<Moon className='size-4' />
					<span className='flex-1'>Oscuro</span>
					{theme === 'dark' && <span className='size-1.5 rounded-full bg-primary' aria-hidden='true' />}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')} className='gap-2'>
					<Monitor className='size-4' />
					<span className='flex-1'>Sistema</span>
					{theme === 'system' && <span className='size-1.5 rounded-full bg-primary' aria-hidden='true' />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}