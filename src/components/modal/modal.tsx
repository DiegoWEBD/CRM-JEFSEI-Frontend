import { useEffect } from 'react'

type ModalProps = {
	open: boolean
	onClose: () => void
	children: React.ReactNode
	title?: string
}

const Modal = ({ open, onClose, children, title }: ModalProps) => {
	useEffect(() => {
		if (!open) return

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [open, onClose])

	if (!open) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6'
			onClick={onClose}
			role='dialog'
			aria-modal='true'
		>
			<div
				className='bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col'
				onClick={event => event.stopPropagation()}
			>
				<div className='flex justify-between items-center border-b border-gray-100 px-6 py-4'>
					<h2 className='text-xl font-semibold'>{title ?? 'Formulario'}</h2>

					<button
						onClick={onClose}
						className='text-gray-500 hover:text-gray-700 hover:cursor-pointer'
						aria-label='Cerrar modal'
						type='button'
					>
						X
					</button>
				</div>

				<div className='overflow-y-auto p-6'>{children}</div>
			</div>
		</div>
	)
}

export default Modal
