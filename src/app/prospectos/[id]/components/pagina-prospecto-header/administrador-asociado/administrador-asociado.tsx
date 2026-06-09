import Button from '@/components/button/button'
import AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import Link from 'next/link'

type AdministradorAsociadoProps = {
	administrador?: AdministradorCondominio
}

export default function AdministradorAsociado({
	administrador,
}: AdministradorAsociadoProps) {
	return (
		<div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
			<span>
				<span className='text-foreground'>Administrador asociado:</span>{' '}
				{administrador ? administrador.nombre_administrador : '—'}
			</span>
			{administrador?.nombre_administrador ? (
				<Button
					variant='outline'
					size='sm'
					className='px-2 text-[10px]'
					asChild
				>
					<Link href={`/clientes/${administrador.id}`}>Ver perfil</Link>
				</Button>
			) : null}
		</div>
	)
}
