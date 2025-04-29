import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Code, LogOut, Menu, Package, Terminal, User } from 'lucide-react'

export default function DashboardNavbar() {
  const { signOut, profile } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="py-4 bg-richBlack/90 backdrop-blur-md border-b border-slateBlue/20 sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between">
          <Link href="/build" className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-robinEggBlue" />
            <span className="font-comfortaa font-bold text-xl text-whiteSmoke">OptimusCode.io</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/build" 
              className="text-lightGray hover:text-whiteSmoke transition flex items-center gap-1.5"
            >
              <Terminal className="h-4 w-4" />
              <span>Build</span>
            </Link>
            <Link 
              href="/projects" 
              className="text-lightGray hover:text-whiteSmoke transition flex items-center gap-1.5"
            >
              <Package className="h-4 w-4" />
              <span>Projects</span>
            </Link>
            <Link 
              href="/profile" 
              className="text-lightGray hover:text-whiteSmoke transition flex items-center gap-1.5"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            
            <div className="h-6 border-l border-slateBlue/30 mx-2"></div>
            
            <Button
              variant="outline"
              className="border-slateBlue/50 text-lightGray hover:text-whiteSmoke hover:border-slateBlue"
              onClick={() => {
                signOut()
                // Force navigation to landing page
                window.location.href = '/'
              }}
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Sign Out
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-lightGray"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-slateBlue/20 flex flex-col space-y-2">
            <Link 
              href="/build" 
              className="text-lightGray hover:text-whiteSmoke p-2 rounded-md flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Terminal className="h-4 w-4 mr-2" />
              <span>Build</span>
            </Link>
            <Link 
              href="/projects" 
              className="text-lightGray hover:text-whiteSmoke p-2 rounded-md flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Package className="h-4 w-4 mr-2" />
              <span>Projects</span>
            </Link>
            <Link 
              href="/profile" 
              className="text-lightGray hover:text-whiteSmoke p-2 rounded-md flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-4 w-4 mr-2" />
              <span>Profile</span>
            </Link>
            
            <Button
              variant="outline"
              className="mt-2 border-slateBlue/50 text-lightGray hover:text-whiteSmoke hover:border-slateBlue w-full justify-start"
              onClick={() => {
                signOut()
                setMobileMenuOpen(false)
                // Force navigation to landing page
                window.location.href = '/'
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </nav>
        )}
      </Container>
    </header>
  )
}
