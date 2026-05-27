import { classname } from '@/lib/class-name'
import * as DialogPrimitive from '@radix-ui/react-dialog'

export default function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot='dialog-title'
			className={classname('text-lg leading-none font-semibold', className)}
			{...props}
		/>
	)
}
