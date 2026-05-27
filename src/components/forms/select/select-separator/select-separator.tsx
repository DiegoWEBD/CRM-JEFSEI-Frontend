import { classname } from '@/lib/class-name'
import * as SelectPrimitive from '@radix-ui/react-select'

export default function SelectSeparator({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
	return (
		<SelectPrimitive.Separator
			data-slot='select-separator'
			className={classname(
				'bg-border pointer-events-none -mx-1 my-1 h-px',
				className,
			)}
			{...props}
		/>
	)
}
