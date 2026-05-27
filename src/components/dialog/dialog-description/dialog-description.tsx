import { classname } from '@/lib/class-name'
import * as DialogPrimitive from '@radix-ui/react-dialog'

export default function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot='dialog-description'
			className={classname('text-muted-foreground text-sm', className)}
			{...props}
		/>
	)
}
