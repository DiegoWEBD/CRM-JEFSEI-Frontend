import axios from 'axios'

export const eliminarCotizacion = async (
	idSolicitud: number,
	idCotizacion: number,
) => {
	const response = await axios.delete(
		`/api/solicitudes-cotizacion/${idSolicitud}/cotizaciones/${idCotizacion}`,
	)
	return response.data
}