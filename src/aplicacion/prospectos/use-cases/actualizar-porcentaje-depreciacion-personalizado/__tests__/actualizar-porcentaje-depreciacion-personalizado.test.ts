import axios from 'axios'
import { describe, expect, it, vi } from 'vitest'

vi.mock('axios', () => ({ default: { patch: vi.fn() } }))

import { actualizarPorcentajeDepreciacionPersonalizado } from '../actualizar-porcentaje-depreciacion-personalizado'

const axiosMock = vi.mocked(axios)

describe('actualizarPorcentajeDepreciacionPersonalizado — conversión a fracción', () => {
	it('convierte los puntos porcentuales a fracción al enviarlos', async () => {
		await actualizarPorcentajeDepreciacionPersonalizado(7, 20)

		expect(axiosMock.patch).toHaveBeenCalledWith(
			'/api/prospectos/condominios/7/porcentaje-depreciacion-personalizado',
			{ porcentaje_depreciacion_personalizado: 0.2 },
		)
	})

	it('mantiene los decimales en la conversión', async () => {
		await actualizarPorcentajeDepreciacionPersonalizado(7, 12.5)

		expect(axiosMock.patch).toHaveBeenCalledWith(
			'/api/prospectos/condominios/7/porcentaje-depreciacion-personalizado',
			{ porcentaje_depreciacion_personalizado: 0.125 },
		)
	})

	it('envía null para quitar la personalización', async () => {
		await actualizarPorcentajeDepreciacionPersonalizado(7, null)

		expect(axiosMock.patch).toHaveBeenCalledWith(
			'/api/prospectos/condominios/7/porcentaje-depreciacion-personalizado',
			{ porcentaje_depreciacion_personalizado: null },
		)
	})

	it('el 0% se envía como 0 y no como null', async () => {
		await actualizarPorcentajeDepreciacionPersonalizado(7, 0)

		expect(axiosMock.patch).toHaveBeenCalledWith(
			'/api/prospectos/condominios/7/porcentaje-depreciacion-personalizado',
			{ porcentaje_depreciacion_personalizado: 0 },
		)
	})
})
