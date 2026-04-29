import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

type NavElementProps = {
	href: string
	icono: ReactNode
	titulo: string
	open?: boolean
}

const NavElement = ({ href, icono, titulo, open }: NavElementProps) => {
	const pathname = usePathname()

	return (
		<Link
			href={href}
			className='h-11 flex items-center gap-3 p-2 rounded hover:bg-white/10 transition-all'
		>
			<span
				className={`text-xl ${pathname === href ? 'text-primary-hover' : undefined}`}
			>
				{icono}
			</span>
			{open && <span>{titulo}</span>}
		</Link>
	)
}

export default NavElement
