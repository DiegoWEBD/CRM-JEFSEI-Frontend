import { classname } from '@/lib/class-name'

export default function Table({
	className,
	...props
}: React.ComponentProps<'table'>) {
	return (
		<div
			data-slot='table-container'
			className='relative w-full overflow-x-auto'
		>
			<table
				data-slot='table'
				className={classname('w-full caption-bottom text-sm', className)}
				{...props}
			/>
		</div>
	)
}
