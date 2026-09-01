'use client'

import {
	Building2,
	ChartBar,
	FileCheck,
	FileSearch,
	FileText,
	Group,
	Home,
	LayoutDashboard,
	Users,
	type LucideIcon,
} from 'lucide-react'
import NavElement from './nav-element'

const ROLES_GERENTE = [
	'GERENTE_COMERCIAL',
	'GERENTE_GENERAL',
	'GERENTE_OPERACIONES',
	'DESARROLLADOR',
]
const ROLES_EVALUACION = ['EJECUTIVO_EVALUACION_PROYECTOS', ...ROLES_GERENTE]

type NavItem = {
	href: string
	icono: LucideIcon
	titulo: string
	visible: (roles: string[]) => boolean
}

type NavSection = {
	titulo: string
	items: NavItem[]
}

const SECCIONES: NavSection[] = [
	{
		titulo: 'Principal',
		items: [
			{ href: '/', icono: Home, titulo: 'Inicio', visible: () => true },
			{
				href: '/dashboard',
				icono: LayoutDashboard,
				titulo: 'Dashboard',
				visible: r => r.some(c => ROLES_GERENTE.includes(c)),
			},
			{
				href: '/oportunidades',
				icono: ChartBar,
				titulo: 'Oportunidades',
				visible: r => r.some(c => ROLES_GERENTE.includes(c)),
			},
		],
	},
	{
		titulo: 'Comercial',
		items: [
			{
				href: '/prospectos',
				icono: Users,
				titulo: 'Prospectos',
				visible: r => r.length > 0,
			},
			{
				href: '/polizas',
				icono: FileText,
				titulo: 'Pólizas',
				visible: () => true,
			},
			{
				href: '/solicitudes-estudio',
				icono: FileSearch,
				titulo: 'Solicitudes de cotización',
				visible: r => r.some(c => ROLES_EVALUACION.includes(c)),
			},
			{
				href: '/cotizaciones-estudios-emitidos',
				icono: FileCheck,
				titulo: 'Cotizaciones emitidas',
				visible: r => r.some(c => ROLES_EVALUACION.includes(c)),
			},
		],
	},
	{
		titulo: 'Administración',
		items: [
			{
				href: '/personal',
				icono: Group,
				titulo: 'Personal',
				visible: r => r.some(c => ROLES_GERENTE.includes(c)),
			},
			{
				href: '/administradores',
				icono: Building2,
				titulo: 'Administradores',
				visible: r => r.length > 0,
			},
			{
				href: '/configuracion-condominio',
				icono: Building2,
				titulo: 'Parámetros de condominios',
				visible: r =>
					r.some(c =>
						['GERENTE_GENERAL', 'GERENTE_COMERCIAL', 'DESARROLLADOR'].includes(
							c,
						),
					),
			},
		],
	},
]

type NavProps = {
	roles: string[]
}

const Nav = ({ roles }: NavProps) => {
	return (
		<nav aria-label='Navegación principal' className='px-2'>
			<ul className='flex flex-col gap-1'>
				{SECCIONES.map(seccion => {
					const items = seccion.items.filter(i => i.visible(roles))
					if (items.length === 0) return null
					return (
						<li key={seccion.titulo} className='flex flex-col gap-0.5'>
							<p className='px-3 pt-4 pb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground/80 select-none group-data-[mode=collapsed]/sidebar:hidden'>
								{seccion.titulo}
							</p>
							{items.map(item => (
								<NavElement
									key={item.href}
									href={item.href}
									icono={<item.icono className='size-4.5' />}
									titulo={item.titulo}
								/>
							))}
						</li>
					)
				})}
			</ul>
		</nav>
	)
}

export default Nav
