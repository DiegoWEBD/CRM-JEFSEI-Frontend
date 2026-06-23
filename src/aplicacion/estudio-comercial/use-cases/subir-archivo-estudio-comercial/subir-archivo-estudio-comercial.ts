export const subirArchivoEstudioComercial = async (
  idEstudio: number,
  archivo: File,
): Promise<void> => {
  const formData = new FormData()
  formData.append('archivo', archivo)

  await fetch(`/api/estudio-comercial/${idEstudio}/archivo`, {
    method: 'POST',
    body: formData,
  })
}
