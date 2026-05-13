import Nav from './nav/nav'
import SideBarClient from './sidebar-client/sidebar-client'

const SideBar = async () => {
	return (
		<SideBarClient>
			<Nav open />
		</SideBarClient>
	)
}

export default SideBar
