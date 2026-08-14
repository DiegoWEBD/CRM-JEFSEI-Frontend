'use client'

import { Menu } from 'lucide-react'
import { useSidebarStore } from '@/global_states/sidebar-store'
import { useIsMobile } from '@/components/use-mobile/use-mobile'
import { Button } from '@/components/button'

const ToggleSidebarButton = () => {
	const isMobile = useIsMobile()
	const { toggle, toggleMode } = useSidebarStore()

	return (
		<Button
			variant='ghost'
			size='icon-sm'
			onClick={isMobile ? toggle : toggleMode}
			aria-label={isMobile ? 'Abrir menú' : 'Contraer menú'}
			title={isMobile ? 'Abrir menú' : 'Contraer menú'}
			className='text-muted-foreground hover:text-foreground'
		>
			<Menu className='size-4' />
		</Button>
	)
}

export default ToggleSidebarButton