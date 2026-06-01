const FormError = ({ children }: { children: string }) => {
	return <p className='text-red-500 italic text-xs'>{children}</p>
}

export default FormError
