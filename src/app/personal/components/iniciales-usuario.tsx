import { CSSProperties } from 'react'

type InicialesUsuarioProps = {
	nombre: string
	style?: CSSProperties
}

const InicialesUsuario = ({ nombre, style }: InicialesUsuarioProps) => {
	const arrayNombre = nombre.trim().split(' ')

	return (
		<div
			className='bg-primary/10 flex w-9 h-9 font-semibold rounded-full items-center justify-center text-primary text-sm'
			style={style}
		>
			<p>{arrayNombre[0]?.charAt(0).toUpperCase()}</p>
			<p>{arrayNombre[1]?.charAt(0).toUpperCase()}</p>
		</div>
	)
}

export default InicialesUsuario
