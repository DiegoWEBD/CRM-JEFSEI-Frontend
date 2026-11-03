import axios from 'axios'

export async function actualizarPorcentajeDepreciacionPersonalizado(
	id: number,
	porcentaje: number | null,
): Promise<void> {
	await axios.patch(
		`/api/prospectos/condominios/${id}/porcentaje-depreciacion-personalizado`,
		{
			porcentaje_depreciacion_personalizado:
				porcentaje == null ? null : porcentaje / 100,
		},
	)
}
