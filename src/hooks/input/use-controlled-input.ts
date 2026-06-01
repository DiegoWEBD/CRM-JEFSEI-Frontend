import { ChangeEvent, useState } from 'react'

export const useControlledInput = () => {
	const [value, setValue] = useState<string>('')

	const handleChange = (
		event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
	) => setValue(event.target.value)

	return { value, handleChange }
}
