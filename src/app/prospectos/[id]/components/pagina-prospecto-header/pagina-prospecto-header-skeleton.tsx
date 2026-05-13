import Card from '@/components/card/card'

const PaginaProspectoHeaderSkeleton = () => {
	return (
		<Card className='flex flex-col md:flex-row gap-4 py-8 px-6 animate-pulse'>
			<div className='flex gap-6 w-full items-center'>
				{/* Avatar */}
				<div className='h-14 w-14 rounded-full bg-skeleton shrink-0' />

				<div className='w-full max-w-sm'>
					{/* Nombre */}
					<div className='h-7 w-52 rounded bg-skeleton mb-4' />

					{/* Contacto */}
					<div className='flex items-center gap-2 mb-3'>
						<div className='h-4 w-4 rounded bg-skeleton' />
						<div className='h-4 w-40 rounded bg-skeleton' />
					</div>

					{/* Línea negocio */}
					<div className='flex items-center gap-2'>
						<div className='h-4 w-4 rounded bg-skeleton' />
						<div className='h-4 w-32 rounded bg-skeleton' />
					</div>
				</div>
			</div>

			<div className='w-full flex flex-col md:items-end'>
				{/* Estado */}
				<div className='h-8 w-32 rounded-full bg-skeleton' />

				<div className='space-y-3 mt-4 w-full md:w-fit'>
					{/* Comercial */}
					<div className='flex gap-2 items-center md:justify-end'>
						<div className='h-4 w-4 rounded bg-skeleton' />
						<div className='h-4 w-20 rounded bg-skeleton' />
						<div className='h-4 w-28 rounded bg-skeleton' />
					</div>

					{/* Evaluación */}
					<div className='flex gap-2 items-center md:justify-end'>
						<div className='h-4 w-4 rounded bg-skeleton' />
						<div className='h-4 w-20 rounded bg-skeleton' />
						<div className='h-4 w-28 rounded bg-skeleton' />
					</div>
				</div>
			</div>
		</Card>
	)
}

export default PaginaProspectoHeaderSkeleton
