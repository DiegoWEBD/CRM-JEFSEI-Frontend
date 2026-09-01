import { getSession } from '@/lib/auth'
import SideBarClient from './sidebar-client/sidebar-client'

const SideBar = async () => {
	const session = await getSession()
	const roles = session?.codigo_roles ?? []

	return <SideBarClient roles={roles} />
}

export default SideBar
