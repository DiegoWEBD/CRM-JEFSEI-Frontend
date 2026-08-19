export type SubirArchivoResponse = {
	id: number
	id_prospecto: number
	nombre_original: string
	nombre_almacenado: string
	message: string
}

export const subirArchivo = async (
	idProspecto: number,
	archivo: File,
): Promise<SubirArchivoResponse> => {
	const formData = new FormData()
	formData.append('archivo', archivo)

	const response = await fetch(`/api/prospectos/${idProspecto}/archivos`, {
		method: 'POST',
		body: formData,
	})

	if (!response.ok) {
		const errorData = await response.json().catch(() => null)
		throw new Error(
			errorData?.error || errorData?.detail || 'Error al subir el archivo',
		)
	}

	return response.json()
}
