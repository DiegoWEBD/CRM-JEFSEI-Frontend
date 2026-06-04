import { classname } from '@/lib/class-name'
import * as DialogPrimitive from '@radix-ui/react-dialog'

export default function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot='dialog-overlay'
			className={classname(
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-70 bg-black/50',
				className,
			)}
			{...props}
		/>
	)
}
