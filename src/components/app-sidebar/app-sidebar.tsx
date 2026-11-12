import { getSession } from '@/lib/auth'
import AppSidebarClient from './app-sidebar-client/app-sidebar-client'

const AppSidebar = async () => {
	const session = await getSession()
	const roles = session?.codigo_roles ?? []

	return <AppSidebarClient roles={roles} />
}

export default AppSidebar
