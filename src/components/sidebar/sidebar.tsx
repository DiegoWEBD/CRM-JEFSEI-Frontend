import { useState } from 'react'
import { FaBars } from 'react-icons/fa6'
import Nav from './nav/nav'

const SideBar = () => {
	const [open, setOpen] = useState<boolean>(true)

	return (
		<aside
			className={`bg-secondary text-white transition-all duration-300
				${open ? 'w-64' : 'w-16'}`}
		>
			<div className='p-5 flex justify-between items-center border-b border-border-secondary'>
				{open ? <span>Menú</span> : null}

				<button
					onClick={() => setOpen(!open)}
					className='px-2 py-1 rounded hover:cursor-pointer hover:bg-white/10 transition-all'
				>
					<FaBars />
				</button>
			</div>

			<Nav open={open} />
		</aside>
	)
}

export default SideBar
