import { type RefObject, useEffect } from 'react'

export function useIntersectionObserver(
	ref: RefObject<HTMLElement | null>,
	options: {
		onIntersect: () => void
		enabled: boolean
		rootRef?: RefObject<HTMLElement | null>
		rootSelector?: string
		rootMargin?: string
	},
) {
	const { onIntersect, enabled, rootRef, rootSelector, rootMargin = '0px' } = options

	useEffect(() => {
		const element = ref.current
		if (!element || !enabled) return

		let root: Element | null = null
		if (rootRef?.current) {
			root = rootSelector
				? rootRef.current.querySelector(rootSelector)
				: rootRef.current
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					onIntersect()
				}
			},
			{
				root,
				threshold: 0,
				rootMargin,
			},
		)

		observer.observe(element)
		return () => observer.disconnect()
	}, [ref, enabled, onIntersect, rootRef, rootSelector, rootMargin])
}
