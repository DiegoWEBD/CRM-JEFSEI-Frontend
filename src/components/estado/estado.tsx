import { twMerge } from 'tailwind-merge'

type EstadoProps = {
	children: string
	fondoTailwind?: string
	textoTailwind?: string
	bordeTailwind?: string
	conBorde?: boolean
	className?: string
	color?: string
}

const Estado = ({
	children,
	fondoTailwind,
	textoTailwind,
	bordeTailwind,
	conBorde,
	className,
	color,
}: EstadoProps) => {
	const fondoTailwind2 = color
		? `bg-${color}-200`
		: 'bg-background-estado-default'
	const textoTailwind2 = color
		? `text-${color}-700`
		: 'text-text-estado-default'
	const bordeTailwind2 = color
		? `border-${color}-300`
		: 'border-border-estado-default'

	console.log(color)
	console.log(fondoTailwind2, textoTailwind2, bordeTailwind2)

	return (
		<p
			className={twMerge(
				'rounded-lg py-1 px-3 h-fit w-fit',
				className,
				fondoTailwind2,
				textoTailwind2,
				conBorde ? `border ${bordeTailwind2}` : '',
			)}
		>
			{children}
		</p>
	)
}

export default Estado
