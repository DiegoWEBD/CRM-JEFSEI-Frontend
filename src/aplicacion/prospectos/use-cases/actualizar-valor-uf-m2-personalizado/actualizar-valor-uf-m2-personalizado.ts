import axios from 'axios'

export async function actualizarValorUfM2Personalizado(
	id: number,
	valor_uf_m2_personalizado: number | null,
): Promise<void> {
	await axios.patch(
		`/api/prospectos/condominios/${id}/valor-uf-m2-personalizado`,
		{ valor_uf_m2_personalizado },
	)
}
