import Card from '../card/card'

const Calendario = ({ className }: { className?: string }) => {
	return (
		<div className={className}>
			<Card className='w-full overflow-hidden p-1' padding={false}>
				<iframe
					src='https://calendar.google.com/calendar/embed?src=TU_CALENDAR_ID'
					className='w-full h-100 md:h-125 lg:h-150'
					loading='lazy'
				/>
			</Card>
		</div>
	)
}

export default Calendario
