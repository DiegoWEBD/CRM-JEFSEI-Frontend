import { HistorialEstadoJson } from '@/aplicacion/estados/dto/historial-estado-json'
import InicialesUsuario from '@/app/personal/components/iniciales-usuario'
import { normalizarFechaTexto } from '@/utils/normalizar-fecha-texto'

type ItemHistorialEstadosProps = { estado: HistorialEstadoJson }

const ItemHistorialEstados = ({ estado }: ItemHistorialEstadosProps) => {
	const fechaRegistro = new Date(estado.fecha_registro)
	const fecha = normalizarFechaTexto(fechaRegistro)
	const hora = fechaRegistro.toLocaleTimeString()

	return (
		<div className='flex gap-4 md:items-center'>
			<div>
				<InicialesUsuario nombre={estado.cambiado_por} />
			</div>
			<div className='w-full flex flex-col gap-y-1 gap-x-4 md:flex-row md:justify-between'>
				<div>
					<p>{estado.estado_actual}</p>
					<p className='text-sm text-subtitle'>{estado.cambiado_por}</p>
				</div>
				<div className='text-sm'>
					<p>{fecha}</p> <p className='text-subtitle'>{hora}</p>
				</div>
			</div>
		</div>
	)
}
export default ItemHistorialEstados
