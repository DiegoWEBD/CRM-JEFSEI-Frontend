import axios from 'axios'

export const eliminarArchivo = async (
	idProspecto: number,
	idArchivo: number,
): Promise<string> => {
	const response = await axios.delete(
		`/api/prospectos/${idProspecto}/archivos/${idArchivo}`,
	)
	return response.data.message
}
