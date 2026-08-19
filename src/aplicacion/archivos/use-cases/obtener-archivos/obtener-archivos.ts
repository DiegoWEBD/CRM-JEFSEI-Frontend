import axios from 'axios'
import type Archivo from '@/dominio/archivo/archivo'

export const obtenerArchivos = async (
	idProspecto: number,
): Promise<Archivo[]> => {
	const response = await axios.get(`/api/prospectos/${idProspecto}/archivos`)
	return response.data.archivos
}
