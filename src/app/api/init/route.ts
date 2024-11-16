import { NextResponse } from 'next/server'
import { initializeServices } from '@/lib/initialize'

export async function GET() {
  try {
    await initializeServices()
    return NextResponse.json({ status: 'Services initialized successfully' })
  } catch (error) {
    console.error('Initialization failed:', error)
    return NextResponse.json(
      { error: 'Failed to initialize services' },
      { status: 500 }
    )
  }
}
