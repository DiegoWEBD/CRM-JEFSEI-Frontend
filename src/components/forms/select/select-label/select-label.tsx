import { classname } from '@/lib/class-name'
import * as SelectPrimitive from '@radix-ui/react-select'

export default function SelectLabel({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
	return (
		<SelectPrimitive.Label
			data-slot='select-label'
			className={classname(
				'text-muted-foreground px-2 py-1.5 text-xs',
				className,
			)}
			{...props}
		/>
	)
}
