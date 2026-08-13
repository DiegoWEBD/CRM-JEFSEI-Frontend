import axios from 'axios'
import type Contacto from '@/dominio/contacto/contacto'
import type { ActualizarContactoRequest } from './dto/actualizar-contacto-request'

export const actualizarContacto = async (
	id: number,
	request: ActualizarContactoRequest,
): Promise<{ data: Contacto; message: string }> => {
	const response = await axios.put(`/api/contactos/${id}`, request)
	return { data: response.data.data, message: response.data.message }
}