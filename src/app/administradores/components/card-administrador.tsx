import AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import { Badge } from '@/components/badge/badge'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import { resaltarTexto } from '@/lib/resaltar-texto'
import { Building2, Mail, Phone, User } from 'lucide-react'
import Link from 'next/link'
import { BadgeVariant } from '@/lib/badge-variants'

interface CardAdministradorProps {
	administrador: AdministradorCondominio
	textoBusqueda?: string
}

function obtenerVarianteBadge(cantidad: number): BadgeVariant {
	if (cantidad === 0) return 'pastel-slate'
	if (cantidad <= 3) return 'pastel-blue'
	if (cantidad <= 10) return 'pastel-emerald'
	return 'pastel-violet'
}

export default function CardAdministrador({
	administrador,
	textoBusqueda = '',
}: CardAdministradorProps) {
	const varianteBadge = obtenerVarianteBadge(administrador.cantidad_condominios)

	return (
		<Card className='overflow-hidden transition-shadow hover:shadow-md'>
			<CardContent className='p-4'>
				<div className='flex items-start gap-3'>
					<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
						<Building2 className='size-4 text-primary' />
					</div>

					<div className='min-w-0 flex-1 space-y-1.5 text-xs'>
						<div className='flex flex-wrap items-center gap-2'>
							<p className='truncate text-sm font-semibold leading-snug text-foreground'>
								{resaltarTexto(
									administrador.nombre_administrador,
									textoBusqueda,
								)}
							</p>
							<Badge
								variant={varianteBadge}
								className='shrink-0 text-[10px] font-semibold'
							>
								{administrador.cantidad_condominios}{' '}
								{administrador.cantidad_condominios === 1
									? 'condominio'
									: 'condominios'}
							</Badge>
						</div>

						<div className='flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground'>
							{administrador.nombre_contacto && (
								<span className='flex min-w-0 items-center gap-1.5'>
									<User size={13} className='shrink-0' />
									<span className='truncate'>
										{resaltarTexto(
											administrador.nombre_contacto,
											textoBusqueda,
										)}
									</span>
								</span>
							)}
							{administrador.telefono && (
								<span className='flex shrink-0 items-center gap-1.5'>
									<Phone size={13} className='shrink-0' />
									<span>{administrador.telefono}</span>
								</span>
							)}
							{administrador.correo && (
								<span className='flex min-w-0 items-center gap-1.5'>
									<Mail size={13} className='shrink-0' />
									<span className='truncate'>
										{resaltarTexto(administrador.correo, textoBusqueda)}
									</span>
								</span>
							)}
						</div>

						{!administrador.nombre_contacto &&
							!administrador.telefono &&
							!administrador.correo && (
								<p className='text-xs italic text-muted-foreground'>
									Sin información de contacto
								</p>
							)}
					</div>

					<Button
						size='sm'
						variant='outline'
						className='h-8 shrink-0 px-3 text-xs transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground'
					>
						<Link href={`/administradores/${administrador.id}`}>
							Ver perfil
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
