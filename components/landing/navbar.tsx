'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-richBlack/70 backdrop-blur-lg shadow-md'
          : 'bg-transparent'
      }`}
    >
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-whiteSmoke/80 hover:text-whiteSmoke transition-colors font-questrial"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="default" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button variant="gradient" size="default" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-whiteSmoke"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-berkeleyBlue/95 backdrop-blur-lg">
          <Container className="py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-whiteSmoke/80 hover:text-whiteSmoke transition-colors py-2 font-questrial"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-whiteSmoke/10">
                <Button variant="outline" size="default" asChild className="w-full">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button variant="gradient" size="default" asChild className="w-full">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
