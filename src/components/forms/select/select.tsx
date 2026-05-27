import * as SelectPrimitive from '@radix-ui/react-select'

export default function Select({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
	return <SelectPrimitive.Root data-slot='select' {...props} />
}
