'use client'

import Card from '../card/card'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import esLocale from '@fullcalendar/core/locales/es'

type CalendarioProps = {
	className?: string
}

const Calendario = ({ className }: CalendarioProps) => {
	return (
		<div className={className}>
			<Card className='w-full overflow-hidden p-4'>
				<FullCalendar
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView='dayGridMonth'
					locale={esLocale}
					height='auto'
					headerToolbar={{
						left: 'prev,next today',
						center: 'title',
						right: 'dayGridMonth,timeGridWeek,timeGridDay',
					}}
					events={[
						{
							title: 'Reunión',
							date: '2026-05-07',
						},
						{
							title: 'Llamada',
							date: '2026-05-08',
						},
					]}
				/>
			</Card>
		</div>
	)
}

export default Calendario
