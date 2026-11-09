import { Suspense } from 'react'
import { ProductosPageSkeleton } from './components/productos-page-skeleton'
import { PanelInner } from './panel-inner'

export default function ProductosPage() {
	return (
		<Suspense fallback={<ProductosPageSkeleton />}>
			<PanelInner />
		</Suspense>
	)
}
