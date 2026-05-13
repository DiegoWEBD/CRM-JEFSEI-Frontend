type TituloPrincipalProps = {
	children: string
	className?: string
}

const TituloPrincipal = ({ children, className }: TituloPrincipalProps) => {
	return <h1 className={`text-2xl font-bold  ${className}`}>{children}</h1>
}

export default TituloPrincipal
