import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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
        if (!credentials?.username || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
        })
        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        if (!isValid) return null

        return { id: String(user.id), name: user.username }
      },
    }),
  ],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
})
