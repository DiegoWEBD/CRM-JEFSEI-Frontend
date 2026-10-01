import { obtenerRegistrosAuditoria } from '@/aplicacion/auditoria/use-cases/obtener-registros-auditoria'
import AuditoriaClient from './components/auditoria-client'

export async function PanelInner() {
	const resultado = await obtenerRegistrosAuditoria({
		categoria: 'AUTENTICACION',
		pagina: 1,
		tamanoPagina: 15,
	})

	return <AuditoriaClient initialData={resultado} />
}
