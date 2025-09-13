import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextRequest } from "next/server"

// Demo kullanıcıları
const demoUsers = [
  {
    id: "1",
    email: "owner@demo.com",
    password: "demo123",
    name: "Demo Owner",
    role: "COMPANY_OWNER",
    companyId: "demo-company",
    company: { id: "demo-company", name: "Demo Company" }
  },
  {
    id: "2", 
    email: "manager@demo.com",
    password: "demo123",
    name: "Demo Manager",
    role: "PROPERTY_MANAGER",
    companyId: "demo-company",
    company: { id: "demo-company", name: "Demo Company" }
  }
]

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Demo kullanıcıları kontrol et
        const user = demoUsers.find(
          user => user.email === credentials.email && user.password === credentials.password
        )

        if (!user) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          company: user.company,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.companyId = user.companyId
        token.company = user.company
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.companyId = token.companyId as string
        session.user.company = token.company as any
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "demo-secret-key-for-development",
}

const handler = NextAuth(authOptions)

export async function GET(req: NextRequest) {
  return handler(req)
}

export async function POST(req: NextRequest) {
  return handler(req)
}