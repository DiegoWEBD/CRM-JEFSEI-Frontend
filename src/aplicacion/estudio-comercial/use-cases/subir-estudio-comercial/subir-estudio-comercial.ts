export type SubirEstudioComercialResponse = {
  id: number
  id_solicitud: number
  nombre_archivo: string
  mensaje: string
}

export const subirEstudioComercial = async (
  solicitudId: number,
  archivo: File,
): Promise<SubirEstudioComercialResponse> => {
  const formData = new FormData()
  formData.append('archivo', archivo)

  const response = await fetch(
    `/api/solicitudes-cotizacion/${solicitudId}/estudios-comerciales`,
    { method: 'POST', body: formData },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.error || errorData?.detail || 'Error al subir el estudio comercial',
    )
  }

  return response.json()
}
