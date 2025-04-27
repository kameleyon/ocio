import React from 'react'
import LoginForm from '@/components/auth/login-form'
import Navbar from '@/components/landing/navbar'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <LoginForm />
    </main>
  )
}
