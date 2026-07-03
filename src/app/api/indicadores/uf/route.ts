import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const res = await fetch('https://mindicador.cl/api/uf')
		const data = await res.json()
		console.log(data)
		const valor = data?.serie?.[0]?.valor ?? null
		console.log(valor)
		return NextResponse.json({ valor })
	} catch {
		return NextResponse.json({ valor: null }, { status: 502 })
	}
}
