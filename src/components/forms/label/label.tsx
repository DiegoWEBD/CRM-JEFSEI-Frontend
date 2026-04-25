type LabelProps = {
	children: React.ReactNode
}

const Label = (props: LabelProps) => {
	return <label>{props.children}</label>
}

export default Label
