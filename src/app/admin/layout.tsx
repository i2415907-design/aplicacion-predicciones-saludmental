'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Shield, FileText, Bell, Bot, LayoutDashboard, Presentation } from 'lucide-react'

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/encuestas', label: 'Encuestas', icon: FileText },
  { href: '/admin/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/admin/chatbot', label: 'Copiloto Clínico IA', icon: Bot },
  { href: '/admin/diapositivas', label: 'Diapositivas', icon: Presentation },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login')
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  // Si está en el modo de presentación de diapositivas, permitir lienzo completo inmersivo
  if (pathname.startsWith('/admin/diapositivas')) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">Panel de Administración</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/diapositivas"
                className="px-3 py-1.5 bg-slate-900 dark:bg-black hover:bg-slate-800 text-slate-100 border border-slate-700 dark:border-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Presentation className="w-3.5 h-3.5 text-indigo-400" />
                <span>Diapositivas</span>
              </Link>
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">Psicólogo de turno:</span>
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">{user.alias}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0">
            <nav className="bg-white dark:bg-gray-900 rounded-xl shadow-xs p-2 sticky top-20 border border-slate-200/80 dark:border-slate-800">
              {adminNavItems.map((item) => {
                const Icon = item.icon
                const isActive = item.href === '/admin' 
                  ? pathname === '/admin' 
                  : pathname.startsWith(item.href)
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
