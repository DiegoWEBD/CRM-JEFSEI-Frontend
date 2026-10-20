/**
 * El prorrateo se almacena como fracción decimal del todo (0,0085 = 0,85 %).
 * Para lectura humana se muestra como porcentaje.
 */
export const formatearProrrateoPorcentaje = (prorrateo: number): string => {
	const porcentaje = prorrateo * 100
	return `${Number(porcentaje.toFixed(6))} %`
}
