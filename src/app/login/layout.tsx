import MainContentLayout from '@/components/layouts/main-content-layout/main-content-layout'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<MainContentLayout className='bg-secondary'>{children}</MainContentLayout>
	)
}

export default AuthLayout
