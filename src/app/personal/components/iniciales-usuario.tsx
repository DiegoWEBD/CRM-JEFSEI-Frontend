import { twMerge } from 'tailwind-merge'
import { CSSProperties } from 'react'

type InicialesUsuarioProps = {
	nombre: string
	primary?: boolean
	className?: string
	style?: CSSProperties
}

const InicialesUsuario = ({
	nombre,
	primary,
	className,
	style,
}: InicialesUsuarioProps) => {
	const arrayNombre = nombre.trim().split(' ')

	const colors = primary
		? 'bg-primary-highlight text-primary-text'
		: 'text-primary-highlight bg-primary-highlight-light'

	return (
		<div
			className={twMerge(
				'flex w-9 h-9 font-semibold rounded-full items-center justify-center',
				colors,
				className,
			)}
			style={style}
		>
			<p>{arrayNombre[0]?.charAt(0).toUpperCase()}</p>
			<p>{arrayNombre[1]?.charAt(0).toUpperCase()}</p>
		</div>
	)
}

export default InicialesUsuario
