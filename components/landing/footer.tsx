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
  Mail
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
    <footer className="bg-berkeleyBlue py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
          {/* Logo and Newsletter */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-whiteSmoke font-comfortaa">
                OptimusCode<span className="text-slateBlue">.</span>io
              </span>
            </Link>
            
            <p className="text-lightGray mb-6 text-sm">
              Transform text into production-ready code with AI.
            </p>
            
            <div className="mb-6">
              <p className="text-whiteSmoke mb-3 font-medium">Subscribe to our newsletter</p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none border-r-0"
                />
                <Button variant="gradient" className="rounded-l-none">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="col-span-1 md:col-span-2">
              <h3 className="text-whiteSmoke font-bold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href} 
                      className="text-lightGray hover:text-whiteSmoke transition-colors flex items-center"
                    >
                      {link.icon && <link.icon className="h-4 w-4 mr-2" />}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-slateBlue/20 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-lightGray text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} OptimusCode.io. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <Link href="#" className="text-lightGray hover:text-whiteSmoke text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-lightGray hover:text-whiteSmoke text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-lightGray hover:text-whiteSmoke text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
