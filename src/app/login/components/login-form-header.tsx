import { CardHeader } from '@/components/card'

const LoginFormHeader = () => {
	return (
		<CardHeader className='items-start gap-1 pb-0 text-left'>
			<div className='mb-4 grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground'>
				<span className='text-sm font-semibold leading-none'>IB</span>
			</div>
			<h1 className='text-xl font-semibold tracking-tight text-foreground'>Bienvenido</h1>
			<p className='text-[13px] text-muted-foreground'>Inicia sesión para acceder al CRM</p>
		</CardHeader>
	)
}

export default LoginFormHeader