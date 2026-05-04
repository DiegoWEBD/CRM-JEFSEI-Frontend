import Card from '@/components/card/card'

const PanelInformativo = () => {
	return (
		<div className='space-y-4'>
			<h2 className='text-lg font-semibold text-primary-highlight'>
				Panel Informativo
			</h2>

			{[1, 2, 3].map(item => (
				<Card key={item}>
					<div className='flex items-center gap-3 mb-2'>
						<div className='w-10 h-10 rounded-full bg-gray-300 shrink-0' />
						<div>
							<p className='font-semibold md:text-base'>JUAN SOTO</p>
							<p className='text-xs text-gray-500'>Fecha / Hora</p>
						</div>
					</div>

					<p className='text-gray-700'>
						Mensaje informativo del equipo o gerencia.
					</p>
				</Card>
			))}
		</div>
	)
}

export default PanelInformativo
