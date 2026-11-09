import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Producto from '@/dominio/producto/producto'
import { payloadSesion } from '@/test/fixtures/sesion'
import { renderConSesion } from '@/test/helpers/render-con-sesion'
import TablaProductos from '../tabla-productos'

function crearProducto(id: number, nombre: string): Producto {
	return new Producto(id, nombre, 1, null, false)
}

const propsBase = {
	pagina: 1,
	totalPaginas: 1,
	onPaginaChange: () => {},
	onEditar: () => {},
	onEliminar: () => {},
	nombreLineaNegocio: () => 'Línea Sintética',
}

describe('TablaProductos — estados de carga', () => {
	it('muestra filas skeleton dentro de la tabla mientras carga sin datos', () => {
		render(
			<TablaProductos {...propsBase} productos={[]} isFetching={true} />,
		)

		// El shell de la tabla se mantiene: headers visibles.
		expect(screen.getByText('Nombre')).toBeInTheDocument()
		expect(screen.getByText('Línea de negocio')).toBeInTheDocument()
		expect(screen.getByText('Acciones')).toBeInTheDocument()
		// 1 fila de header + 5 filas skeleton.
		expect(screen.getAllByRole('row')).toHaveLength(6)
		expect(screen.queryByText('No se encontraron productos')).toBeNull()
	})

	it('reemplaza las filas por skeletons de la misma cantidad al recargar con datos', () => {
		const productos = [
			crearProducto(1, 'Producto Alfa'),
			crearProducto(2, 'Producto Beta'),
		]
		render(
			<TablaProductos {...propsBase} productos={productos} isFetching={true} />,
		)

		// Las filas reales no se muestran durante la recarga…
		expect(screen.queryByText('Producto Alfa')).toBeNull()
		expect(screen.queryByText('Producto Beta')).toBeNull()
		// …y se mantienen la fila de header + 2 filas skeleton.
		expect(screen.getAllByRole('row')).toHaveLength(3)
	})

	it('muestra el mensaje vacío cuando no carga y no hay productos', () => {
		render(
			<TablaProductos {...propsBase} productos={[]} isFetching={false} />,
		)

		expect(screen.getByText('No se encontraron productos')).toBeInTheDocument()
		expect(screen.queryByRole('table')).toBeNull()
	})

	it('muestra las filas reales cuando hay datos y no está cargando', async () => {
		const productos = [crearProducto(1, 'Producto Alfa')]
		await renderConSesion(
			payloadSesion({ codigo_permisos: ['ADMINISTRAR_PRODUCTOS'] }),
			<TablaProductos
				{...propsBase}
				productos={productos}
				isFetching={false}
			/>,
		)

		// El nombre aparece en la card mobile y en la fila desktop (ambas en el DOM).
		expect(screen.getAllByText('Producto Alfa')).toHaveLength(2)
		expect(screen.queryByText('No se encontraron productos')).toBeNull()
		// 1 fila de header + 1 fila real.
		expect(screen.getAllByRole('row')).toHaveLength(2)
	})
})
