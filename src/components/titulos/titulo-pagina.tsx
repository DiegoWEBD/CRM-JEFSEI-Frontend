import TituloPrincipal from './titulo-principal'

type TituloPaginaProps = {
	children: string
}

const TituloPagina = ({ children }: TituloPaginaProps) => {
	return <TituloPrincipal className='mt-2 mb-6'>{children}</TituloPrincipal>
}

export default TituloPagina
