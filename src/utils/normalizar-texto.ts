export const normalizarTexto = (
	texto: string | null,
	primeraMayuscula?: boolean,
): string => {
	if (!texto) return ''

	const textoNormalizado = texto
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')

	if (primeraMayuscula) {
		return textoNormalizado.charAt(0).toUpperCase() + textoNormalizado.slice(1)
	}

	return textoNormalizado
}
