import { twMerge } from 'tailwind-merge'

type EstadoProps = {
	children: string
	fondoTailwind?: string
	textoTailwind?: string
	bordeTailwind?: string
	conBorde?: boolean
	className?: string
}

const Estado = ({
	children,
	fondoTailwind,
	textoTailwind,
	bordeTailwind,
	conBorde,
	className,
}: EstadoProps) => {
	const fondo = fondoTailwind || 'bg-background-estado-default'
	const texto = textoTailwind || 'text-text-estado-default'
	const borde = bordeTailwind || 'border-border-estado-default'

	return (
		<p
			className={twMerge(
				'rounded-lg py-1 px-3 h-fit w-fit',
				className,
				fondo,
				texto,
				conBorde ? `border ${borde}` : '',
			)}
		>
			{children}
		</p>
	)
}

export default Estado
