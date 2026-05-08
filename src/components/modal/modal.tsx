type ModalProps = {
	open: boolean
	onClose: () => void
	children: React.ReactNode
	title?: string
}

const Modal = ({ open, onClose, children, title }: ModalProps) => {
	if (!open) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
			<div className='bg-white rounded-2xl min-w-120'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-semibold'>{title}</h2>

					<button onClick={onClose}>X</button>
				</div>

				{children}
			</div>
		</div>
	)
}

export default Modal
