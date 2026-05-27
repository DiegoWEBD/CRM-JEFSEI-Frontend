import * as DialogPrimitive from '@radix-ui/react-dialog'

export default function Dialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot='dialog' {...props} />
}
