import Card from '@/components/card/card'
import { useAuthStore } from '@/global_states/auth_store'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'

const ProspectosAsignados = () => {
	const { usuario } = useAuthStore()
	const { prospectos } = useObtenerProspectos(usuario?.rut)

	return (
		<Card>
			{prospectos.map(prospecto => (
				<div key={prospecto.nombre_riesgo}>
					<div>
						<p>{prospecto.nombre_riesgo}</p>
						<p>{prospecto.nombre_contacto}</p>
					</div>
					<div>
						<p>{prospecto.linea_negocio}</p>
						<p>{prospecto.estado}</p>
						<p>{prospecto.fecha_ultima_accion}</p>
						<p>{prospecto.proxima_accion}</p>
					</div>
				</div>
			))}
		</Card>
	)
}

export default ProspectosAsignados
