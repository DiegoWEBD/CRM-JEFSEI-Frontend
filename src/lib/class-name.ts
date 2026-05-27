import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const classname = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}
