import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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
import ContenedorPolizas from '../contenedor-polizas'

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

describe('ContenedorPolizas — estados de carga', () => {
	it('muestra 10 filas skeleton mientras carga, incluso con datos previos', () => {
		const { container } = render(
			<ContenedorPolizas
				polizas={[crearPoliza('POL-001', 'Producto Hogar')]}
				isLoading={true}
			/>,
		)

		expect(container.querySelectorAll('li')).toHaveLength(10)
		expect(screen.queryByText('POL-001')).toBeNull()
	})

	it('muestra el mensaje vacío cuando no carga y no hay pólizas', () => {
		render(<ContenedorPolizas polizas={[]} isLoading={false} />)

		expect(
			screen.getByText('Aún no hay pólizas registradas para este cliente.'),
		).toBeInTheDocument()
	})

	it('muestra las pólizas agrupadas cuando hay datos y no está cargando', () => {
		render(
			<ContenedorPolizas
				polizas={[crearPoliza('POL-001', 'Producto Hogar')]}
				isLoading={false}
			/>,
		)

		expect(screen.getByText('Producto Hogar')).toBeInTheDocument()
		expect(screen.getByText(/Mostrando/)).toBeInTheDocument()
		expect(screen.queryByText(/Cargando pólizas/)).toBeNull()
	})
})
