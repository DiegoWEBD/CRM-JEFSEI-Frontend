import { obtenerProductos } from '@/aplicacion/producto/use-cases/obtener-productos'
import { Suspense } from 'react'
import ProductosClient from './components/productos-client'
import { ProductosPageSkeleton } from './components/productos-page-skeleton'

async function ProductosInner() {
	const resultado = await obtenerProductos()

	return <ProductosClient initialData={resultado} />
}

const ProductosPage = () => {
	return (
		<Suspense fallback={<ProductosPageSkeleton />}>
			<ProductosInner />
		</Suspense>
	)
}

export default ProductosPage
