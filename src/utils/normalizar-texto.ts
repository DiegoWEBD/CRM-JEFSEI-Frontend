export const normalizarTexto = (texto: string | null): string => {
	if (!texto) return ''

	return texto
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
}
