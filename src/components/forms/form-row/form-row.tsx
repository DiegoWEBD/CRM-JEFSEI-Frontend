import { ReactNode } from 'react'

type FormRowProps = {
	children: ReactNode
}

export default function FormRow({ children }: FormRowProps) {
	return <div className='space-y-3'>{children}</div>
}
