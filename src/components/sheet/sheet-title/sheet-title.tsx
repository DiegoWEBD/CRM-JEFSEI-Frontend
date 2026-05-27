import { classname } from '@/lib/class-name'
import * as SheetPrimitive from '@radix-ui/react-dialog'

export default function SheetTitle({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
	return (
		<SheetPrimitive.Title
			data-slot='sheet-title'
			className={classname('text-foreground font-semibold', className)}
			{...props}
		/>
	)
}
