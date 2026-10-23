import axios from 'axios'

export const descargarDesgloseReconstruccion = async (
	idProceso: number,
): Promise<Blob> => {
	const response = await axios.get(
		`/api/procesos-comerciales/${idProceso}/desglose-reconstruccion/excel`,
		{ responseType: 'blob' },
	)
	return response.data
}
