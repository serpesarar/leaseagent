import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      companyId: string
      company: {
        id: string
        name: string
        subdomain: string
      }
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: string
    companyId: string
    company: {
      id: string
      name: string
      subdomain: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string
    companyId: string
    company: {
      id: string
      name: string
      subdomain: string
    }
  }
}

