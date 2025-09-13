import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const status = searchParams.get('status') || 'ACTIVE'

    const contractors = await prisma.contractor.findMany({
      where: {
        companyId: session.user.companyId,
        status: status as any,
        ...(specialty && {
          specialties: {
            has: specialty
          }
        })
      },
      orderBy: [
        { isPreferred: 'desc' },
        { rating: 'desc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({ contractors })

  } catch (error) {
    console.error('Error fetching contractors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contractors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['COMPANY_OWNER', 'PROPERTY_MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      email,
      phone,
      address,
      website,
      description,
      specialties,
      hourlyRate,
      licenseNumber,
      insuranceInfo,
      availability
    } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const contractor = await prisma.contractor.create({
      data: {
        name,
        email,
        phone,
        address,
        website,
        description,
        specialties: specialties || [],
        hourlyRate,
        licenseNumber,
        insuranceInfo,
        availability,
        companyId: session.user.companyId
      }
    })

    return NextResponse.json({
      success: true,
      contractor
    })

  } catch (error) {
    console.error('Error creating contractor:', error)
    return NextResponse.json(
      { error: 'Failed to create contractor' },
      { status: 500 }
    )
  }
}

