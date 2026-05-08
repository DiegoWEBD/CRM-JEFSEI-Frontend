type EstadoProps = {
	children: string
	fondoTailwind?: string
	textoTailwind?: string
	bordeTailwind?: string
	conBorde?: boolean
}

const Estado = ({
	children,
	fondoTailwind,
	textoTailwind,
	bordeTailwind,
	conBorde,
}: EstadoProps) => {
	return (
		<p
			className={`${fondoTailwind} ${textoTailwind} ${bordeTailwind} ${conBorde && 'border'} text-xs rounded-full py-1 px-3 h-fit w-fit`}
		>
			{children}
		</p>
	)
}

export default Estado
