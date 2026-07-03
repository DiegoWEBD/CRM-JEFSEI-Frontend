import {
	Building2,
	ChartBar,
	FileCheck,
	FileSearch,
	Group,
	Home,
	LayoutDashboard,
	Users,
} from 'lucide-react'
import NavElement from './nav-element'
import { getSession } from '@/lib/auth'

type NavProps = {
	open?: boolean
}

function tieneAlgunRol(codigoRoles: string[], roles: string[]): boolean {
	return codigoRoles.some(codigo => roles.includes(codigo))
}

const ROLES_GERENTE = [
	'GERENTE_COMERCIAL',
	'GERENTE_GENERAL',
	'GERENTE_OPERACIONES',
]
const ROLES_PERSONAL = ROLES_GERENTE
const ROLES_EVALUACION = ['EJECUTIVO_EVALUACION_PROYECTOS', ...ROLES_GERENTE]
const Nav = async ({ open }: NavProps) => {
	const session = await getSession()
	const roles = session?.codigo_roles ?? []

	return (
		<nav className='mt-4 px-2'>
			<ul className='flex flex-col gap-3'>
				<NavElement href='/' icono={<Home />} titulo='Inicio' open={open} />

				{tieneAlgunRol(roles, ROLES_GERENTE) && (
					<NavElement
						href='/dashboard'
						icono={<LayoutDashboard />}
						titulo='Dashboard'
						open={open}
					/>
				)}

				{tieneAlgunRol(roles, ROLES_GERENTE) && (
					<NavElement
						href='/oportunidades'
						icono={<ChartBar />}
						titulo='Oportunidades'
						open={open}
					/>
				)}

				{session && (
					<NavElement
						href='/prospectos'
						icono={<Users />}
						titulo='Prospectos'
						open={open}
					/>
				)}

				{tieneAlgunRol(roles, ROLES_EVALUACION) && (
					<NavElement
						href='/solicitudes-estudio'
						icono={<FileSearch />}
						titulo='Solicitudes de cotización'
						open={open}
					/>
				)}

				{tieneAlgunRol(roles, ROLES_EVALUACION) && (
					<NavElement
						href='/cotizaciones-estudios-emitidos'
						icono={<FileCheck />}
						titulo='Cotizaciones / estudios emitidos'
						open={open}
					/>
				)}

				{tieneAlgunRol(roles, ROLES_PERSONAL) && (
					<NavElement
						href='/personal'
						icono={<Group />}
						titulo='Personal'
						open={open}
					/>
				)}

				{session && (
					<NavElement
						href='/administradores'
						icono={<Building2 />}
						titulo='Administradores de condominios'
						open={open}
					/>
				)}
			</ul>
		</nav>
	)
}

export default Nav
