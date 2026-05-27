import * as SheetPrimitive from '@radix-ui/react-dialog'

export default function SheetClose({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
	return <SheetPrimitive.Close data-slot='sheet-close' {...props} />
}
