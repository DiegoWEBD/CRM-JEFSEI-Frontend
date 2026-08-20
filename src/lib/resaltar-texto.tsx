import React from 'react'

function normalizarTexto(texto: string): string {
	return texto
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
}

function normalizarRut(texto: string): string {
	return texto.replace(/[.-]/g, '')
}

const CLASE_RESALTADO = 'text-blue-500 bg-transparent'

/**
 * Encuentra en el texto original la posición correspondiente
 * a una búsqueda normalizada, ignorando tildes y mayúsculas.
 */
function encontrarRango(
	texto: string,
	busqueda: string,
): { inicio: number; fin: number } | null {
	const textoNorm = normalizarTexto(texto)
	const busquedaNorm = normalizarTexto(busqueda)

	if (!busquedaNorm) return null

	const indice = textoNorm.indexOf(busquedaNorm)

	if (indice === -1) return null

	let posicionNorm = 0
	let inicio = -1
	let fin = -1

	for (let i = 0; i < texto.length; i++) {
		const caracterNorm = normalizarTexto(texto[i])
		const longitud = caracterNorm.length

		if (
			inicio === -1 &&
			posicionNorm >= indice &&
			posicionNorm < indice + busquedaNorm.length
		) {
			inicio = i
		}

		if (
			inicio !== -1 &&
			posicionNorm + longitud >= indice + busquedaNorm.length
		) {
			fin = i + 1
			break
		}

		posicionNorm += longitud
	}

	if (inicio === -1) return null

	if (fin === -1) {
		fin = texto.length
	}

	return { inicio, fin }
}

export function resaltarTexto(
	texto: string,
	busqueda: string,
): React.ReactNode {
	if (!busqueda.trim()) return texto

	const rango = encontrarRango(texto, busqueda)

	if (!rango) return texto

	return (
		<>
			{texto.slice(0, rango.inicio)}
			<mark className={CLASE_RESALTADO}>
				{texto.slice(rango.inicio, rango.fin)}
			</mark>
			{texto.slice(rango.fin)}
		</>
	)
}

export function resaltarRut(texto: string, busqueda: string): React.ReactNode {
	if (!busqueda.trim()) return texto

	const textoNorm = normalizarRut(texto).toLowerCase()
	const busquedaNorm = normalizarRut(busqueda).toLowerCase()

	if (!busquedaNorm) return texto

	const indice = textoNorm.indexOf(busquedaNorm)

	if (indice === -1) return texto

	const fin = indice + busquedaNorm.length

	const resaltar = new Array(texto.length).fill(false)

	let posicionNorm = 0

	for (let i = 0; i < texto.length; i++) {
		const caracter = texto[i]

		if (caracter !== '.' && caracter !== '-') {
			if (posicionNorm >= indice && posicionNorm < fin) {
				resaltar[i] = true
			}

			posicionNorm++
		}
	}

	// También resalta los puntos y guiones que estén
	// dentro del rango encontrado.
	for (let i = 0; i < texto.length; i++) {
		if (
			(texto[i] === '.' || texto[i] === '-') &&
			i > 0 &&
			i < texto.length - 1
		) {
			const antes = texto.slice(0, i).replace(/[.-]/g, '')

			const despues = texto.slice(i + 1).replace(/[.-]/g, '')

			const posicionAntes = antes.length
			const posicionDespues = textoNorm.length - despues.length

			if (posicionAntes > indice && posicionDespues < fin) {
				resaltar[i] = true
			}
		}
	}

	const resultado: React.ReactNode[] = []

	let grupoInicio = -1

	for (let i = 0; i <= texto.length; i++) {
		if (i < texto.length && resaltar[i]) {
			if (grupoInicio === -1) {
				grupoInicio = i
			}
		} else {
			if (grupoInicio !== -1) {
				resultado.push(
					<mark key={grupoInicio} className={CLASE_RESALTADO}>
						{texto.slice(grupoInicio, i)}
					</mark>,
				)

				grupoInicio = -1
			}

			if (i < texto.length && !resaltar[i]) {
				resultado.push(texto[i])
			}
		}
	}

	return resultado
}
