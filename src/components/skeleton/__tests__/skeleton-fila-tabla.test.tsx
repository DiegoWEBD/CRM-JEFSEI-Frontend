import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SkeletonFilaTabla, SkeletonFilasTabla } from '../skeleton-fila-tabla'

describe('SkeletonFilaTabla', () => {
	it('renderiza 10 filas skeleton de tabla por defecto', () => {
		const { container } = render(
			<table>
				<tbody>
					<SkeletonFilasTabla />
				</tbody>
			</table>,
		)

		expect(container.querySelectorAll('tbody tr')).toHaveLength(10)
	})

	it('renderiza la cantidad de celdas indicada en una fila de tabla', () => {
		render(
			<table>
				<tbody>
					<SkeletonFilaTabla celdas={7} />
				</tbody>
			</table>,
		)

		expect(screen.getAllByRole('row')).toHaveLength(1)
		expect(screen.getAllByRole('cell')).toHaveLength(7)
	})

	it('renderiza filas de lista como <li> en contexto lista', () => {
		const { container } = render(
			<ul>
				<SkeletonFilasTabla cantidad={10} contexto='lista' celdas={6} />
			</ul>,
		)

		expect(container.querySelectorAll('ul > li')).toHaveLength(10)
	})
})
