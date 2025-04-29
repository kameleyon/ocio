'use client'

import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Container } from '@/components/ui/container'
import DashboardNavbar from '@/components/dashboard/navbar'
import BuildInterface from '@/components/build/build-interface'
import { useAuth } from '@/contexts/auth-context'
import { redirect } from 'next/navigation'

export default function BuildPage() {
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!loading && !user) {
      redirect('/login')
    }
  }, [loading, user])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-richBlack">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin border-t-2 border-slateBlue rounded-full"></div>
          <p className="text-lightGray">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-richBlack">
      <DashboardNavbar />
      
      <Container className="flex-grow py-6 md:py-8">
        <h1 className="mb-6 font-comfortaa text-2xl font-bold text-whiteSmoke md:text-3xl">
          Build Your App
        </h1>
        
        <BuildInterface projectId={projectId || undefined} />
      </Container>
    </main>
  )
}
