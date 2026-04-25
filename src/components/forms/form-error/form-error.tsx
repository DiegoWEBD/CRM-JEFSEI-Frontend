const FormError = ({ children }: { children: string }) => {
	return <p className='text-red-500 italic text-sm'>{children}</p>
}

export default FormError
