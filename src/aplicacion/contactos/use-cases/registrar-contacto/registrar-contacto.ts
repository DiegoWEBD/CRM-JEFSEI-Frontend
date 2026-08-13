import axios from 'axios'
import type Contacto from '@/dominio/contacto/contacto'
import type { RegistrarContactoRequest } from './dto/registrar-contacto-request'

export const registrarContacto = async (
	idProspecto: number,
	request: RegistrarContactoRequest,
): Promise<{ data: Contacto; message: string }> => {
	const response = await axios.post(`/api/prospectos/${idProspecto}/contactos`, request)
	return { data: response.data.data, message: response.data.message }
}