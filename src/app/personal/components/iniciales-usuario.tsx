type InicialesUsuarioProps = {
	nombre: string
	primary?: boolean
	className?: string
}

const InicialesUsuario = ({
	nombre,
	primary,
	className,
}: InicialesUsuarioProps) => {
	const arrayNombre = nombre.split(' ')

	const colors = primary
		? 'bg-primary-highlight text-primary-text'
		: 'text-primary-highlight bg-primary-highlight-light'

	return (
		<div
			className={`flex w-9 h-9 font-semibold rounded-full items-center justify-center ${colors} ${className || ''}`}
		>
			<p>{arrayNombre[0].charAt(0).toUpperCase()}</p>
			<p>{arrayNombre[1]?.charAt(0).toUpperCase()}</p>
		</div>
	)
}

export default InicialesUsuario
