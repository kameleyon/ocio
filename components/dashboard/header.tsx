'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, X, User } from 'lucide-react'

const navigation = [
  { name: 'Build', href: '/build' },
  { name: 'Projects', href: '/projects' },
]

export default function DashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-berkeleyBlue/70 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 shadow-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-whiteSmoke font-comfortaa">
                OptimusCode<span className="text-slateBlue">.</span>io
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'text-slateBlue'
                    : 'text-whiteSmoke/80 hover:text-whiteSmoke'
                } transition-colors font-questrial`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-whiteSmoke"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-berkeleyBlue/95 backdrop-blur-lg">
          <Container className="py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'text-slateBlue'
                      : 'text-whiteSmoke/80 hover:text-whiteSmoke'
                  } transition-colors py-2 font-questrial`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-whiteSmoke/10">
                <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
