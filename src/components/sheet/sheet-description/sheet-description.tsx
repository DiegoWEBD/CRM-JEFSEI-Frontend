import { classname } from '@/lib/class-name'
import * as SheetPrimitive from '@radix-ui/react-dialog'

export default function SheetDescription({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
	return (
		<SheetPrimitive.Description
			data-slot='sheet-description'
			className={classname('text-muted-foreground text-sm', className)}
			{...props}
		/>
	)
}
