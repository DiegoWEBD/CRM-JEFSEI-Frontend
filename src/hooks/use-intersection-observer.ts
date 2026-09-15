import { type RefObject, useEffect, useRef } from 'react'

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
	const {
		onIntersect,
		enabled,
		rootRef,
		rootSelector,
		rootMargin = '0px',
	} = options

	const prevIntersectingRef = useRef(false)

	useEffect(() => {
		const element = ref.current
		if (!element || !enabled) {
			prevIntersectingRef.current = false
			return
		}

		let root: Element | null = null
		if (rootRef?.current) {
			root = rootSelector
				? rootRef.current.querySelector(rootSelector)
				: rootRef.current
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !prevIntersectingRef.current) {
					onIntersect()
				}
				prevIntersectingRef.current = entry.isIntersecting
			},
			{ root, threshold: 0, rootMargin },
		)

		observer.observe(element)
		return () => observer.disconnect()
	}, [ref, enabled, onIntersect, rootRef, rootSelector, rootMargin])
}
