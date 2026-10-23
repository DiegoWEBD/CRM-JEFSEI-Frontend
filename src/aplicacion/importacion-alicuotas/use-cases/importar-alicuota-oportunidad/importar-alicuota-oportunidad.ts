import type { ImportacionAlicuotasResultado } from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import axios from 'axios'

export interface ImportarAlicuotaOportunidadRequest {
	nombre_excel: string
	unidades: ImportacionAlicuotasResultado['unidades']
}

export const importarAlicuotaOportunidad = async (
	idProceso: number,
	request: ImportarAlicuotaOportunidadRequest,
): Promise<void> => {
	await axios.post(`/api/procesos-comerciales/${idProceso}/alicuota`, request)
}
