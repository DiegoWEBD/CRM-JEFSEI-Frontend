import LoginForm from './components/login-form'
import { ShieldCheck } from 'lucide-react'

const LoginPage = () => {
	return (
		<div className='grid h-full w-full overflow-hidden lg:grid-cols-2'>
			{/* Panel de marca (desktop) */}
			<aside className='relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex'>
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-0 opacity-20'
					style={{
						backgroundImage:
							'radial-gradient(circle at 20% 20%, oklch(1 0 0 / 0.25), transparent 40%), radial-gradient(circle at 80% 80%, oklch(0.7 0.18 200 / 0.3), transparent 40%)',
					}}
				/>
				<div className='relative flex items-center gap-3'>
					<div className='grid size-10 place-items-center rounded-xl bg-primary-foreground/15 ring-1 ring-primary-foreground/20'>
						<span className='text-base font-semibold leading-none'>IB</span>
					</div>
					<span className='text-base font-semibold tracking-tight'>
						CRM JEFSEI
					</span>
				</div>

				<div className='relative max-w-md space-y-6'>
					<ShieldCheck className='size-10' strokeWidth={1.5} />
					<div className='space-y-3'>
						<h2 className='text-3xl font-semibold leading-tight tracking-tight'>
							Gestión comercial y operacional, en un solo lugar.
						</h2>
						<p className='text-md leading-relaxed text-primary-foreground/80'>
							Cotizaciones, estudios, pólizas y cobranza centralizadas para todo
							el equipo.
						</p>
					</div>
				</div>

				<p className='relative text-xs text-primary-foreground/60'>
					v1.1 © 2026 JEFSEI · Corredora de Seguros
				</p>
			</aside>

			{/* Formulario */}
			<main className='flex items-center justify-center bg-background p-6 sm:p-10'>
				<LoginForm />
			</main>
		</div>
	)
}

export default LoginPage
