import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"

/**
 * NextAuth configuration for authentication.
 * Uses credentials provider to authenticate users from the database.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Authorizes user by checking email and password against database.
       * Returns user object if valid, null otherwise.
       */
      async authorize(credentials) {
        // Validate credentials
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user in database
        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            business: true,
          },
        })

        if (!user) {
          return null
        }

        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Return user data for session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          businessId: user.businessId,
          business: user.business,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for session storage
  },
  pages: {
    signIn: "/login", // Custom login page
    signOut: "/", // Redirect to home after logout
  },
  callbacks: {
    /**
     * Adds user data to JWT token when user signs in.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.businessId = user.businessId
        token.business = user.business
      }
      return token
    },
    /**
     * Adds user data from token to session object.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.businessId = token.businessId as string | null
        session.user.business = token.business as any
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

