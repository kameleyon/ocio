"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Container } from '@/components/ui/container'
import { redirect } from 'next/navigation'
import UserProfile from '@/components/profile/user-profile'
import DashboardNavbar from '@/components/dashboard/navbar'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle authentication state
  if (mounted && !loading && !user) {
    redirect('/login')
  }

  // Show nothing while checking auth or before hydration
  if (loading || !mounted) {
    return null
  }

  return (
    <>
      <DashboardNavbar />
      <Container className="py-8">
        <UserProfile />
      </Container>
    </>
  )
}
