import axios from 'axios'

export const eliminarSolicitudCotizacion = async (idSolicitud: number) => {
	const response = await axios.delete(
		`/api/solicitudes-cotizacion/${idSolicitud}`,
	)
	return response.data
}