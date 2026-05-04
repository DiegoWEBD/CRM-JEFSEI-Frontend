import Card from '@/components/card/card'
import Usuario from '@/dominio/usuario/usuario'
import InicialesUsuario from './iniciales-usuario'

type ContenedorUsuariosProps = {
	usuarios: Usuario[]
}

const ContenedorUsuarios = ({ usuarios }: ContenedorUsuariosProps) => {
	return (
		<div>
			{usuarios.map(usuario => {
				return (
					<Card key={usuario.rut} className='flex items-center gap-4'>
						<InicialesUsuario nombre={usuario.nombre} />
						<p>{usuario.nombre}</p>
					</Card>
				)
			})}
		</div>
	)
}

export default ContenedorUsuarios
