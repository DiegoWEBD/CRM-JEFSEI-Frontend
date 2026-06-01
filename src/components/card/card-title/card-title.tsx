import { classname } from '@/lib/class-name'

type CardTitleProps = React.ComponentProps<'div'> & {
	primary?: boolean
}

export default function CardTitle({
	className,
	primary,
	...props
}: CardTitleProps) {
	return (
		<div
			data-slot='card-title'
			className={classname(
				'leading-none font-semibold',
				primary &&
					'text-sm font-semibold leading-tight tracking-tight text-foreground',
				className,
			)}
			{...props}
		/>
	)
}
