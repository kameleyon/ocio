'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-md">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-whiteSmoke hover:text-slateBlue transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to home</span>
          </Link>
        </div>

        <Card isGlass={true} className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-slateBlue/20 flex items-center justify-center">
              <Mail className="h-8 w-8 text-slateBlue" />
            </div>
            <h1 className="text-2xl font-bold text-whiteSmoke">Check your email</h1>
            <p className="text-lightGray">
              We've sent you a verification link to confirm your email address
            </p>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-sm text-lightGray mb-4">
              Please check your inbox and click the verification link to complete your registration.
              If you don't see the email, check your spam folder.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col justify-center space-y-4 border-t border-slateBlue/20 pt-4">
            <p className="text-lightGray text-sm">
              Already verified?{' '}
              <Link href="/login" className="text-slateBlue hover:text-robinEggBlue transition-colors">
                Log in now
              </Link>
            </p>
            <p className="text-lightGray text-sm">
              <Link href="/signup" className="text-slateBlue hover:text-robinEggBlue transition-colors">
                Use a different email
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Container>
    </div>
  )
}
