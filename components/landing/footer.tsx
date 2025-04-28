'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  ArrowRight, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Terminal
} from 'lucide-react'

const footerLinks = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'FAQ', href: '#faq' },
      { name: 'Roadmap', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '#' },
      { name: 'Guides', href: '#' },
      { name: 'Support', href: '#' },
      { name: 'API', href: '#' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'GitHub', href: '#', icon: Github },
      { name: 'LinkedIn', href: '#', icon: Linkedin },
      { name: 'Contact', href: '#', icon: Mail },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-berkeleyBlue relative">
      {/* Top subtle gradient */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-richBlack to-transparent pointer-events-none" />
      
      {/* Dense footer content */}
      <Container className="pt-24 pb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
          {/* Logo and Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:pr-8">
            <Link href="/" className="inline-flex items-center mb-6">
              <Terminal size={22} className="mr-2 text-robinEggBlue" />
              <span className="text-2xl font-bold text-whiteSmoke font-comfortaa">
                Optimus<span className="text-slateBlue">Code</span><span className="text-robinEggBlue">.</span>io
              </span>
            </Link>
            
            <p className="text-lightGray mb-6 text-sm">
              Transform plain text into production-ready full-stack applications with our AI-powered code generation platform.
            </p>
            
            <div className="mb-6">
              <p className="text-whiteSmoke mb-3 font-medium font-comfortaa">Stay updated on new features</p>
              <div className="flex glassmorphism rounded-lg p-1 border border-slateBlue/30">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-transparent border-0 focus:ring-0 rounded-r-none"
                />
                <Button variant="gradient" size="sm" className="rounded-l-none">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-lightGray/60 text-xs mt-2">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
          
          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="col-span-1 md:col-span-2">
              <h3 className="text-whiteSmoke font-bold mb-4 font-comfortaa text-sm">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href} 
                      className="text-lightGray hover:text-whiteSmoke transition-colors flex items-center text-sm"
                    >
                      {link.icon && <link.icon className="h-4 w-4 mr-2 text-slateBlue" />}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-slateBlue/20 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-lightGray/60 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} OptimusCode.io. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <Link href="#" className="text-lightGray/60 hover:text-whiteSmoke text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-lightGray/60 hover:text-whiteSmoke text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-lightGray/60 hover:text-whiteSmoke text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
