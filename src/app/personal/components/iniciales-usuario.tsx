type InicialesUsuarioProps = {
	nombre: string
	primary?: boolean
}

const InicialesUsuario = ({ nombre, primary }: InicialesUsuarioProps) => {
	const arrayNombre = nombre.split(' ')

	return (
		<div
			className={`flex w-9 h-9 font-semibold rounded-full items-center justify-center ${primary ? 'bg-primary-highlight text-primary-text' : 'text-primary-highlight bg-blue-100'}`}
		>
			<p>{arrayNombre[0].charAt(0)}</p>
			<p>{arrayNombre[1]?.charAt(0)}</p>
		</div>
	)
}

export default InicialesUsuario
