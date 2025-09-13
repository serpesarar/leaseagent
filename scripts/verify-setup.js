#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying Phase 1 Setup...\n')

// Check if files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.ts',
  'tsconfig.json',
  'prisma/schema.prisma',
  'src/lib/auth.ts',
  'src/lib/prisma.ts',
  'src/components/route-guard.tsx',
  'src/app/layout.tsx',
  'src/app/dashboard/layout.tsx',
  'src/app/tenant/dashboard/page.tsx',
  'src/app/contractor/dashboard/page.tsx',
  'public/manifest.json',
  'public/sw.js',
  '.env.example'
]

let allFilesExist = true

console.log('📁 Checking required files:')
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file))
  console.log(`${exists ? '✅' : '❌'} ${file}`)
  if (!exists) allFilesExist = false
})

console.log('\n📦 Checking package.json dependencies:')
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))

const requiredDeps = [
  'next',
  'react',
  'react-dom',
  '@prisma/client',
  'prisma',
  'next-auth',
  '@next-auth/prisma-adapter',
  'next-pwa',
  'typescript',
  'tailwindcss',
  'zustand',
  'lucide-react'
]

let allDepsInstalled = true
requiredDeps.forEach(dep => {
  const exists = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
  console.log(`${exists ? '✅' : '❌'} ${dep}${exists ? ` (${exists})` : ''}`)
  if (!exists) allDepsInstalled = false
})

console.log('\n🔧 Checking configuration files:')

// Check Next.js config
try {
  const nextConfig = fs.readFileSync(path.join(__dirname, '..', 'next.config.js'), 'utf8')
  const hasPWA = nextConfig.includes('withPWA')
  console.log(`${hasPWA ? '✅' : '❌'} Next.js PWA configuration`)
} catch (error) {
  console.log('❌ next.config.js not found or invalid')
  allFilesExist = false
}

// Check Prisma schema
try {
  const prismaSchema = fs.readFileSync(path.join(__dirname, '..', 'prisma', 'schema.prisma'), 'utf8')
  const hasUserModel = prismaSchema.includes('model User')
  const hasPropertyModel = prismaSchema.includes('model Property')
  const hasMaintenanceModel = prismaSchema.includes('model MaintenanceRequest')
  
  console.log(`${hasUserModel ? '✅' : '❌'} User model in Prisma schema`)
  console.log(`${hasPropertyModel ? '✅' : '❌'} Property model in Prisma schema`)
  console.log(`${hasMaintenanceModel ? '✅' : '❌'} MaintenanceRequest model in Prisma schema`)
} catch (error) {
  console.log('❌ Prisma schema not found or invalid')
  allFilesExist = false
}

// Check PWA manifest
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'manifest.json'), 'utf8'))
  const hasName = manifest.name
  const hasIcons = manifest.icons && manifest.icons.length > 0
  const hasStartUrl = manifest.start_url
  
  console.log(`${hasName ? '✅' : '❌'} PWA manifest has name`)
  console.log(`${hasIcons ? '✅' : '❌'} PWA manifest has icons`)
  console.log(`${hasStartUrl ? '✅' : '❌'} PWA manifest has start_url`)
} catch (error) {
  console.log('❌ PWA manifest not found or invalid')
  allFilesExist = false
}

console.log('\n🚀 Phase 1 Setup Summary:')
console.log(`Files: ${allFilesExist ? '✅ All required files present' : '❌ Some files missing'}`)
console.log(`Dependencies: ${allDepsInstalled ? '✅ All dependencies installed' : '❌ Some dependencies missing'}`)

if (allFilesExist && allDepsInstalled) {
  console.log('\n🎉 Phase 1 setup is complete!')
  console.log('\nNext steps:')
  console.log('1. Set up your environment variables (.env.local)')
  console.log('2. Set up PostgreSQL database')
  console.log('3. Run: npm run db:generate')
  console.log('4. Run: npm run db:push')
  console.log('5. Run: npm run db:seed')
  console.log('6. Run: npm run dev')
  console.log('\nThen visit http://localhost:3000 to see your app!')
} else {
  console.log('\n❌ Phase 1 setup is incomplete. Please check the missing items above.')
}

console.log('\n📖 For detailed setup instructions, see: PHASE1_SETUP.md')

