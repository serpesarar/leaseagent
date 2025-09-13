import { PrismaClient, UserRole, PropertyType, LeaseStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo company
  const demoCompany = await prisma.company.create({
    data: {
      name: 'NYC Property Management',
      subdomain: 'demo',
      email: 'info@nycpm.com',
      phone: '+1 (555) 123-4567',
      address: '123 Broadway, New York, NY 10001',
      website: 'https://nycpm.com',
    }
  })

  console.log('✅ Created demo company')

  // Create demo users
  const hashedPassword = await bcrypt.hash('demo123', 12)

  const companyOwner = await prisma.user.create({
    data: {
      name: 'John Smith',
      email: 'owner@demo.com',
      password: hashedPassword,
      role: UserRole.COMPANY_OWNER,
      phone: '+1 (555) 123-4567',
      companyId: demoCompany.id,
    }
  })

  const propertyManager = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'manager@demo.com',
      password: hashedPassword,
      role: UserRole.PROPERTY_MANAGER,
      phone: '+1 (555) 234-5678',
      companyId: demoCompany.id,
    }
  })

  const tenant1 = await prisma.user.create({
    data: {
      name: 'Mike Davis',
      email: 'tenant1@demo.com',
      password: hashedPassword,
      role: UserRole.TENANT,
      phone: '+1 (555) 345-6789',
      companyId: demoCompany.id,
    }
  })

  const tenant2 = await prisma.user.create({
    data: {
      name: 'Emily Wilson',
      email: 'tenant2@demo.com',
      password: hashedPassword,
      role: UserRole.TENANT,
      phone: '+1 (555) 456-7890',
      companyId: demoCompany.id,
    }
  })

  console.log('✅ Created demo users')

  // Create demo properties
  const property1 = await prisma.property.create({
    data: {
      name: 'Manhattan Heights',
      address: '456 Park Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10016',
      type: PropertyType.APARTMENT,
      description: 'Luxury apartment building in the heart of Manhattan with stunning city views.',
      amenities: ['Gym', 'Rooftop Terrace', 'Concierge', 'Laundry', 'Parking'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
      ],
      companyId: demoCompany.id,
      managerId: propertyManager.id,
    }
  })

  const property2 = await prisma.property.create({
    data: {
      name: 'Brooklyn Commons',
      address: '789 Atlantic Avenue',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11217',
      type: PropertyType.APARTMENT,
      description: 'Modern apartment complex in trendy Brooklyn neighborhood.',
      amenities: ['Gym', 'Courtyard', 'Pet Friendly', 'Bike Storage'],
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
      ],
      companyId: demoCompany.id,
      managerId: propertyManager.id,
    }
  })

  console.log('✅ Created demo properties')

  // Create demo units
  const unit1A = await prisma.unit.create({
    data: {
      number: '1A',
      floor: 1,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 900,
      rent: 3500,
      deposit: 3500,
      propertyId: property1.id,
    }
  })

  const unit2B = await prisma.unit.create({
    data: {
      number: '2B',
      floor: 2,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      rent: 4500,
      deposit: 4500,
      isAvailable: false,
      propertyId: property1.id,
    }
  })

  const unit3A = await prisma.unit.create({
    data: {
      number: '3A',
      floor: 3,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 650,
      rent: 2800,
      deposit: 2800,
      isAvailable: false,
      propertyId: property2.id,
    }
  })

  console.log('✅ Created demo units')

  // Create demo leases
  const lease1 = await prisma.lease.create({
    data: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      monthlyRent: 4500,
      deposit: 4500,
      status: LeaseStatus.ACTIVE,
      terms: 'Standard residential lease agreement with 12-month term.',
      companyId: demoCompany.id,
      propertyId: property1.id,
      unitId: unit2B.id,
      tenantId: tenant1.id,
    }
  })

  const lease2 = await prisma.lease.create({
    data: {
      startDate: new Date('2024-03-01'),
      endDate: new Date('2025-02-28'),
      monthlyRent: 2800,
      deposit: 2800,
      status: LeaseStatus.ACTIVE,
      terms: 'Standard residential lease agreement with 12-month term.',
      companyId: demoCompany.id,
      propertyId: property2.id,
      unitId: unit3A.id,
      tenantId: tenant2.id,
    }
  })

  console.log('✅ Created demo leases')

  // Create demo maintenance requests
  await prisma.maintenanceRequest.create({
    data: {
      title: 'Leaky Faucet in Kitchen',
      description: 'The kitchen faucet has been dripping constantly for the past week.',
      priority: 'MEDIUM',
      status: 'PENDING',
      category: 'Plumbing',
      estimatedCost: 150,
      companyId: demoCompany.id,
      propertyId: property1.id,
      leaseId: lease1.id,
      requesterId: tenant1.id,
    }
  })

  await prisma.maintenanceRequest.create({
    data: {
      title: 'Heating Not Working',
      description: 'The heating system stopped working yesterday evening.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      category: 'HVAC',
      estimatedCost: 300,
      companyId: demoCompany.id,
      propertyId: property2.id,
      leaseId: lease2.id,
      requesterId: tenant2.id,
    }
  })

  console.log('✅ Created demo maintenance requests')

  // Create demo payments
  await prisma.payment.create({
    data: {
      amount: 4500,
      type: 'RENT',
      status: 'COMPLETED',
      description: 'Monthly rent payment - January 2024',
      dueDate: new Date('2024-01-01'),
      paidDate: new Date('2024-01-01'),
      companyId: demoCompany.id,
      leaseId: lease1.id,
      payerId: tenant1.id,
      receiverId: companyOwner.id,
    }
  })

  await prisma.payment.create({
    data: {
      amount: 2800,
      type: 'RENT',
      status: 'PENDING',
      description: 'Monthly rent payment - March 2024',
      dueDate: new Date('2024-03-01'),
      companyId: demoCompany.id,
      leaseId: lease2.id,
      payerId: tenant2.id,
      receiverId: companyOwner.id,
    }
  })

  console.log('✅ Created demo payments')

  // Create demo contractors
  const contractor1 = await prisma.contractor.create({
    data: {
      name: 'Elite Plumbing Services',
      email: 'contact@eliteplumbing.com',
      phone: '+1 (555) 123-4567',
      address: '123 Service Ave, New York, NY 10001',
      website: 'https://eliteplumbing.com',
      description: 'Professional plumbing services with 24/7 emergency support. Licensed and insured.',
      specialties: ['PLUMBING', 'HVAC'],
      rating: 4.8,
      totalJobs: 145,
      completedJobs: 142,
      hourlyRate: 85,
      isPreferred: true,
      licenseNumber: 'PL-2024-001',
      insuranceInfo: {
        provider: 'State Farm',
        policyNumber: 'SF-123456',
        expiryDate: '2024-12-31'
      },
      availability: {
        immediate: true,
        next24h: true,
        weekends: true
      },
      companyId: demoCompany.id,
    }
  })

  const contractor2 = await prisma.contractor.create({
    data: {
      name: 'NYC Electrical Solutions',
      email: 'info@nycelectrical.com',
      phone: '+1 (555) 234-5678',
      address: '456 Electric St, Brooklyn, NY 11201',
      website: 'https://nycelectrical.com',
      description: 'Certified electrical contractors specializing in residential and commercial work.',
      specialties: ['ELECTRICAL', 'SECURITY'],
      rating: 4.6,
      totalJobs: 98,
      completedJobs: 95,
      hourlyRate: 95,
      isPreferred: false,
      licenseNumber: 'EL-2024-002',
      insuranceInfo: {
        provider: 'Liberty Mutual',
        policyNumber: 'LM-789012',
        expiryDate: '2024-11-30'
      },
      availability: {
        immediate: false,
        next24h: true,
        weekends: false
      },
      companyId: demoCompany.id,
    }
  })

  console.log('✅ Created demo contractors')

  // Create demo workflow rules
  await prisma.workflowRule.create({
    data: {
      name: 'Auto-assign Plumbing Issues to Elite Plumbing',
      description: 'Automatically assign all high-priority plumbing issues to Elite Plumbing Services',
      trigger: 'MAINTENANCE_REQUEST_CREATED',
      conditions: {
        category: 'PLUMBING',
        severity: ['HIGH', 'URGENT']
      },
      actions: {
        assignContractor: true,
        sendNotification: true,
        escalateIfUnavailable: true
      },
      priority: 10,
      companyId: demoCompany.id,
      contractorId: contractor1.id,
    }
  })

  await prisma.workflowRule.create({
    data: {
      name: 'Electrical Emergency Response',
      description: 'Immediately assign urgent electrical issues and send alerts',
      trigger: 'MAINTENANCE_REQUEST_CREATED',
      conditions: {
        category: 'ELECTRICAL',
        severity: 'URGENT'
      },
      actions: {
        assignContractor: true,
        sendNotification: true,
        sendEmail: true,
        escalateIssue: true
      },
      priority: 15,
      companyId: demoCompany.id,
      contractorId: contractor2.id,
    }
  })

  console.log('✅ Created demo workflow rules')

  // Create demo notifications
  await prisma.notification.create({
    data: {
      title: 'New Maintenance Request',
      message: 'A new plumbing issue has been reported at Manhattan Heights - Unit 2B',
      type: 'MAINTENANCE_REQUEST',
      status: 'SENT',
      sentAt: new Date(),
      companyId: demoCompany.id,
      userId: propertyManager.id,
      data: {
        maintenanceRequestId: 'demo-request-1',
        property: 'Manhattan Heights',
        unit: '2B'
      }
    }
  })

  await prisma.notification.create({
    data: {
      title: 'Payment Reminder',
      message: 'Rent payment is due tomorrow for Brooklyn Commons - Unit 3A',
      type: 'PAYMENT_REMINDER',
      status: 'READ',
      sentAt: new Date(Date.now() - 86400000), // 1 day ago
      readAt: new Date(Date.now() - 3600000), // 1 hour ago
      companyId: demoCompany.id,
      userId: tenant2.id,
      data: {
        amount: 2800,
        dueDate: '2024-10-01'
      }
    }
  })

  console.log('✅ Created demo notifications')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📋 Demo Login Credentials:')
  console.log('Company Owner: owner@demo.com / demo123')
  console.log('Property Manager: manager@demo.com / demo123')
  console.log('Tenant 1: tenant1@demo.com / demo123')
  console.log('Tenant 2: tenant2@demo.com / demo123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
