const FormError = ({ children }: { children: string }) => {
		return <p className='text-destructive italic text-xs'>{children}</p>
}

export default FormError
