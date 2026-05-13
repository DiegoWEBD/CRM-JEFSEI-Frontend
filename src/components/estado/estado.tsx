import { twMerge } from 'tailwind-merge'

type EstadoProps = {
	children: string
	conBorde?: boolean
	className?: string
	color?: string
}

const Estado = ({
	children,
	conBorde,
	className,
	color = 'oklch(66.6% 0.179 58.318)',
}: EstadoProps) => {
	return (
		<p
			className={twMerge(
				'rounded-lg py-1 px-3 h-fit w-fit',
				conBorde ? 'border' : '',
				className,
			)}
			style={{
				backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
				color,
				borderColor: color,
			}}
		>
			{children}
		</p>
	)
}

export default Estado
