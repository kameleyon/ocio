import React from 'react'
import SignupForm from '@/components/auth/signup-form'
import Navbar from '@/components/landing/navbar'

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <SignupForm />
    </main>
  )
}
