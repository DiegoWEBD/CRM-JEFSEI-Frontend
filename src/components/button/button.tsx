import { classname } from '@/lib/class-name'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'
import { buttonVariants } from './button-variants'

export default function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}) {
	const Comp = asChild ? Slot : 'button'

	return (
		<Comp
			data-slot='button'
			className={classname(
				buttonVariants({ variant, size, className }),
				'hover:cursor-pointer',
			)}
			{...props}
		/>
	)
}
