'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

const SECTIONS = [
	{ id: 'seccion-general', label: 'General' },
	{ id: 'seccion-contactos', label: 'Contactos' },
	{ id: 'seccion-comercial', label: 'Comercial' },
	{ id: 'seccion-polizas', label: 'Pólizas' },
	{ id: 'seccion-seguimiento', label: 'Seguimiento' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

export default function ProspectoStickyNav() {
	const [activeSection, setActiveSection] = useState<SectionId>(
		'seccion-general',
	)
	const observerRef = useRef<IntersectionObserver | null>(null)

	useEffect(() => {
		observerRef.current = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id as SectionId)
					}
				}
			},
			{ rootMargin: '-80px 0px -70% 0px' },
		)

		for (const section of SECTIONS) {
			const el = document.getElementById(section.id)
			if (el) observerRef.current.observe(el)
		}

		return () => {
			observerRef.current?.disconnect()
		}
	}, [])

	function scrollTo(id: SectionId) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
	}

	return (
		<nav className='sticky top-0 z-10 -mx-4 border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
			<div className='flex gap-1 overflow-x-auto py-2'>
				{SECTIONS.map(s => (
					<button
						key={s.id}
						type='button'
						onClick={() => scrollTo(s.id)}
						className={cn(
							'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
							activeSection === s.id
								? 'bg-primary text-primary-foreground'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground',
						)}
					>
						{s.label}
					</button>
				))}
			</div>
		</nav>
	)
}
