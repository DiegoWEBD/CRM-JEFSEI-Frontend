import * as SheetPrimitive from '@radix-ui/react-dialog'

export default function Sheet({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
	return <SheetPrimitive.Root data-slot='sheet' {...props} />
}
