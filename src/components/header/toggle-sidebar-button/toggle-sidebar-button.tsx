'use client'

import { Menu } from 'lucide-react'
import { useSidebar } from '@/components/sidebar'
import { useIsMobile } from '@/components/use-mobile/use-mobile'
import { Button } from '@/components/button'

const ToggleSidebarButton = () => {
	const isMobile = useIsMobile()
	const { toggleSidebar, state } = useSidebar()

	const etiqueta = isMobile
		? 'Abrir menú'
		: state === 'expanded'
			? 'Contraer menú'
			: 'Expandir menú'

	return (
		<Button
			variant='ghost'
			size='icon-sm'
			onClick={toggleSidebar}
			aria-label={etiqueta}
			title={etiqueta}
			className='text-muted-foreground hover:text-foreground'
		>
			<Menu className='size-4' />
		</Button>
	)
}

export default ToggleSidebarButton
