import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { Role } from '@/lib/generated/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
 adapter: PrismaAdapter(prisma as any),
  session: { strategy: 'jwt' },
  trustHost: true,           // ← agregar esta línea
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!passwordMatch) return null
        if (!user.isActive) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatar,
        }
      },
    }),
  ],
  callbacks: {
    // Agrega rol y id al token JWT
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }

      // Permite actualizar la sesión manualmente
      if (trigger === 'update' && session?.role) {
        token.role = session.role
      }

      // Sincronizar rol desde BD en cada refresh
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, isActive: true },
        })
        if (dbUser) token.role = dbUser.role
      }

      return token
    },

    // Expone id y rol en la sesión del cliente
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },

    // Redirige según el rol después del login
    async signIn({ user, account }) {
      // Permitir siempre OAuth
      if (account?.provider === 'google') {
        // Asignar rol VISITANTE si es nuevo usuario Google
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })
        if (dbUser && !dbUser.role) {
          await prisma.user.update({
            where: { email: user.email! },
            data: { role: 'VISITANTE' },
          })
        }
        return true
      }
      return true
    },
  },
})