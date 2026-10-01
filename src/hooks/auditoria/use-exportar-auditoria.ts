import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export type FiltrosExportacionAuditoria = {
	categoria: string | null
	evento: string | null
	textoBusqueda: string
	fechaDesde: string | null
	fechaHasta: string | null
	ipOrigen: string
}

export const useExportarAuditoria = () => {
	return useMutation({
		mutationFn: async (filtros: FiltrosExportacionAuditoria) => {
			const params = new URLSearchParams()
			if (filtros.categoria) params.set('categoria', filtros.categoria)
			if (filtros.evento) params.set('evento', filtros.evento)
			if (filtros.textoBusqueda) params.set('texto_busqueda', filtros.textoBusqueda)
			if (filtros.fechaDesde) params.set('fecha_desde', filtros.fechaDesde)
			if (filtros.fechaHasta) params.set('fecha_hasta', filtros.fechaHasta)
			if (filtros.ipOrigen) params.set('ip_origen', filtros.ipOrigen)

			const response = await axios.get(`/api/auditoria/exportar?${params.toString()}`, {
				responseType: 'blob',
			})

			const url = URL.createObjectURL(response.data)
			const link = document.createElement('a')
			link.href = url
			link.download = `auditoria_${new Date().toISOString().slice(0, 10)}.csv`
			document.body.appendChild(link)
			link.click()
			link.remove()
			URL.revokeObjectURL(url)
		},
	})
}
