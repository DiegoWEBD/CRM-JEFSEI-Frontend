import {
	Building2,
	ChartBar,
	FileCheck,
	FileSearch,
	Group,
	Home,
	LayoutDashboard,
	Package,
	Users,
	type LucideIcon,
} from 'lucide-react'

export type RouteMeta = {
	href: string
	titulo: string
	icono: LucideIcon
}

export const RUTAS_PRINCIPALES: RouteMeta[] = [
	{ href: '/', titulo: 'Inicio', icono: Home },
	{ href: '/dashboard', titulo: 'Dashboard', icono: LayoutDashboard },
	{ href: '/oportunidades', titulo: 'Oportunidades', icono: ChartBar },
	{ href: '/prospectos', titulo: 'Prospectos', icono: Users },
	{
		href: '/solicitudes-estudio',
		titulo: 'Solicitudes de estudio',
		icono: FileSearch,
	},
	{
		href: '/cotizaciones-estudios-emitidos',
		titulo: 'Cotizaciones / estudios',
		icono: FileCheck,
	},
	{ href: '/personal', titulo: 'Personal', icono: Group },
	{ href: '/productos', titulo: 'Productos', icono: Package },
	{ href: '/administradores', titulo: 'Administradores', icono: Building2 },
]

/** Devuelve el título de ruta visible en el header según el pathname. */
export function tituloDeRuta(pathname: string): string {
	const sorted = [...RUTAS_PRINCIPALES].sort(
		(a, b) => b.href.length - a.href.length,
	)
	for (const ruta of sorted) {
		if (pathname.startsWith(ruta.href)) return ruta.titulo
	}
	return 'JEFSEI'
}
