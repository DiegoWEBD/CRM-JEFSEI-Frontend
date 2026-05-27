import { classname } from '@/lib/class-name'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ChevronUpIcon } from 'lucide-react'

export default function SelectScrollUpButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
	return (
		<SelectPrimitive.ScrollUpButton
			data-slot='select-scroll-up-button'
			className={classname(
				'flex cursor-default items-center justify-center py-1',
				className,
			)}
			{...props}
		>
			<ChevronUpIcon className='size-4' />
		</SelectPrimitive.ScrollUpButton>
	)
}
