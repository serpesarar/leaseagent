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

    const workflowRules = await prisma.workflowRule.findMany({
      where: {
        companyId: session.user.companyId
      },
      include: {
        contractor: true
      },
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({ workflowRules })

  } catch (error) {
    console.error('Error fetching workflow rules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflow rules' },
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
      description,
      trigger,
      conditions,
      actions,
      priority = 0,
      contractorId
    } = body

    if (!name || !trigger || !conditions || !actions) {
      return NextResponse.json(
        { error: 'Name, trigger, conditions, and actions are required' },
        { status: 400 }
      )
    }

    const workflowRule = await prisma.workflowRule.create({
      data: {
        name,
        description,
        trigger,
        conditions,
        actions,
        priority,
        contractorId,
        companyId: session.user.companyId
      },
      include: {
        contractor: true
      }
    })

    return NextResponse.json({
      success: true,
      workflowRule
    })

  } catch (error) {
    console.error('Error creating workflow rule:', error)
    return NextResponse.json(
      { error: 'Failed to create workflow rule' },
      { status: 500 }
    )
  }
}

