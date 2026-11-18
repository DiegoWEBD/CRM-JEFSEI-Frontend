import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
	useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next/link', () => ({
	default: ({
		href,
		children,
		...props
	}: {
		href: string
		children: React.ReactNode
	} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}))

import Poliza from '@/dominio/poliza/poliza'
import TablaPolizas from '../tabla-polizas'

function crearPoliza(numero: string, producto: string): Poliza {
	return new Poliza(
		numero,
		'P-1',
		'Cliente Alfa',
		1,
		'nueva',
		producto,
		100,
		10,
		'2026-01-01',
		'VIGENTE',
		false,
		'2026-01-01',
		'2026-12-31',
		{ id: 1, nombre: 'Compañía Uno' },
	)
}

const propsBase = {
	pagina: 1,
	totalPaginas: 1,
	onPaginaChange: () => {},
}

describe('TablaPolizas — estados de carga', () => {
	it('muestra 10 filas skeleton dentro de la tabla mientras carga sin datos', () => {
		render(<TablaPolizas {...propsBase} polizas={[]} isFetching={true} />)

		// El shell de la tabla se mantiene: headers visibles.
		expect(screen.getByText('N° Póliza')).toBeInTheDocument()
		expect(screen.getByText('Prima Neta')).toBeInTheDocument()
		// 1 fila de header + 10 filas skeleton.
		expect(screen.getAllByRole('row')).toHaveLength(11)
		expect(
			screen.queryByText(
				'No se encontraron pólizas con los filtros seleccionados.',
			),
		).toBeNull()
	})

	it('reemplaza las filas por 10 skeletons al recargar con datos', () => {
		const polizas = [
			crearPoliza('POL-001', 'Producto Hogar'),
			crearPoliza('POL-002', 'Producto Auto'),
		]
		render(<TablaPolizas {...propsBase} polizas={polizas} isFetching={true} />)

		// Las filas reales no se muestran durante la recarga…
		expect(screen.queryByText('POL-001')).toBeNull()
		expect(screen.queryByText('POL-002')).toBeNull()
		// …y se mantienen la fila de header + 10 filas skeleton.
		expect(screen.getAllByRole('row')).toHaveLength(11)
	})

	it('muestra el mensaje vacío cuando no carga y no hay pólizas', () => {
		render(<TablaPolizas {...propsBase} polizas={[]} isFetching={false} />)

		expect(
			screen.getByText(
				'No se encontraron pólizas con los filtros seleccionados.',
			),
		).toBeInTheDocument()
		expect(screen.queryByRole('table')).toBeNull()
	})

	it('muestra las filas reales cuando hay datos y no está cargando', () => {
		const polizas = [crearPoliza('POL-001', 'Producto Hogar')]
		render(
			<TablaPolizas {...propsBase} polizas={polizas} isFetching={false} />,
		)

		// El número aparece en la card mobile y en la fila desktop (ambas en el DOM).
		expect(screen.getAllByText('POL-001')).toHaveLength(2)
		// 1 fila de header + 1 fila real.
		expect(screen.getAllByRole('row')).toHaveLength(2)
		expect(
			screen.queryByText(
				'No se encontraron pólizas con los filtros seleccionados.',
			),
		).toBeNull()
	})
})
