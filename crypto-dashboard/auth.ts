import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { CredentialsSchema } from '@/schemas/auth'

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

if (!authSecret) {
  throw new Error(
    'Missing auth secret. Set AUTH_SECRET (recommended) or NEXTAUTH_SECRET before starting the app.'
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: authSecret,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = CredentialsSchema.safeParse(credentials)
        if (!parsed.success) {
          logger.warn('auth', 'Rejected credentials with invalid shape', {
            issues: parsed.error.issues,
          })
          return null
        }

        const { username, password } = parsed.data
        try {
          const user = await prisma.user.findUnique({ where: { username } })
          if (!user) {
            logger.warn('auth', 'Rejected credentials for missing user')
            return null
          }

          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            logger.warn('auth', 'Rejected credentials for password mismatch', { userId: user.id })
            return null
          }

          return { id: String(user.id), name: user.username }
        } catch (error) {
          logger.error('auth', 'Credentials authorization failed', { error })
          throw error
        }
      },
    }),
  ],
  pages: { signIn: '/login' },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === 'string') {
        session.user.id = token.id
      }
      return session
    },
  },
})
