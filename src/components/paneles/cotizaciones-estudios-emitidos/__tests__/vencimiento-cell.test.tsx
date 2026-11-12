import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import type { CotizacionResumen } from '@/aplicacion/cotizaciones-estudios/dto/cotizacion-resumen'
import VencimientoCell from '../vencimiento-cell'

const COTIZACIONES: CotizacionResumen[] = [
	{
		id: 12,
		company: 'Company Dos',
		prima_neta: 20,
		prima_bruta: 23.8,
		fecha_vencimiento: '2100-01-10T00:00:00',
		estado: 'VIGENTE',
	},
	{
		id: 11,
		company: 'Company Uno',
		prima_neta: 10,
		prima_bruta: 11.9,
		fecha_vencimiento: '2100-01-05T00:00:00',
		estado: 'POR_VENCER',
	},
]

describe('VencimientoCell — renderiza desde el resumen de la fila', () => {
	it('sin cotizaciones ni vencimiento muestra un guion', () => {
		render(<VencimientoCell cotizaciones={[]} vencimientoMasProximo={null} />)

		expect(screen.getByText('—')).toBeInTheDocument()
	})

	it('muestra la compañía con vencimiento más próximo y el conteo de opciones', () => {
		render(
			<VencimientoCell
				cotizaciones={COTIZACIONES}
				vencimientoMasProximo='2100-01-05T00:00:00'
			/>,
		)

		expect(screen.getByText('Company Uno')).toBeInTheDocument()
		expect(screen.getByText('2 opciones cotizadas')).toBeInTheDocument()
	})

	it('el popover lista todas las opciones con su estado', async () => {
		const user = userEvent.setup()
		render(
			<VencimientoCell
				cotizaciones={COTIZACIONES}
				vencimientoMasProximo='2100-01-05T00:00:00'
			/>,
		)

		await user.click(screen.getByRole('button'))

		expect(await screen.findByText('Opciones cotizadas')).toBeInTheDocument()
		expect(screen.getAllByText('Company Uno').length).toBeGreaterThan(0)
		expect(screen.getAllByText('Company Dos').length).toBeGreaterThan(0)
		expect(screen.getByText('Vigente')).toBeInTheDocument()
		expect(screen.getByText('Por vencer')).toBeInTheDocument()
	})
})
