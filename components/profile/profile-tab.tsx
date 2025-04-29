"use client"

import React, { useState } from 'react'
import { Profile, updateProfile } from '@/lib/services/auth-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { Check, Loader2, Mail, User as UserIcon, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface ProfileTabProps {
  profile: Profile
}

export default function ProfileTab({ profile }: ProfileTabProps) {
  const { refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [email, setEmail] = useState(profile.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false)
  const [passwordUpdateError, setPasswordUpdateError] = useState('')

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateSuccess(false)
    setUpdateError('')

    try {
      const result = await updateProfile(profile.id, {
        full_name: fullName,
        // Only update email through auth service if it changed
        ...(email !== profile.email && { email })
      })

      if (result.error) {
        throw result.error
      }

      // Update email in auth if it changed
      if (email !== profile.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: email
        })

        if (authError) {
          throw authError
        }
      }

      await refreshProfile()
      setUpdateSuccess(true)
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update profile')
    } finally {
      setIsUpdating(false)
      // Clear success message after 5 seconds
      setTimeout(() => setUpdateSuccess(false), 5000)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setPasswordUpdateSuccess(false)
    setPasswordUpdateError('')

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordUpdateError('New passwords do not match')
      setIsUpdating(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        throw error
      }

      setPasswordUpdateSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
      setCurrentPassword('')
    } catch (error: any) {
      setPasswordUpdateError(error.message || 'Failed to update password')
    } finally {
      setIsUpdating(false)
      // Clear success message after 5 seconds
      setTimeout(() => setPasswordUpdateSuccess(false), 5000)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
        <h2 className="text-xl font-comfortaa font-semibold text-whiteSmoke mb-4">
          Personal Information
        </h2>
        
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="fullName" className="text-lightGray text-sm block">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue w-5 h-5" />
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10 bg-richBlack border-slateBlue/30 focus:border-robinEggBlue text-whiteSmoke"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-lightGray text-sm block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue w-5 h-5" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-richBlack border-slateBlue/30 focus:border-robinEggBlue text-whiteSmoke"
                placeholder="Your email address"
              />
            </div>
          </div>

          {updateSuccess && (
            <div className="flex items-center gap-2 text-green-500 text-sm p-2 rounded-md bg-green-500/10">
              <Check className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {updateError && (
            <div className="flex items-center gap-2 text-red-500 text-sm p-2 rounded-md bg-red-500/10">
              <X className="w-4 h-4" />
              <span>{updateError}</span>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isUpdating}
            className="w-full bg-slateBlue hover:bg-slateBlue/80 text-whiteSmoke"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </Button>
        </form>
      </Card>

      <Card className="p-6 bg-berkeleyBlue/40 backdrop-blur-md border border-slateBlue/20 rounded-xl">
        <h2 className="text-xl font-comfortaa font-semibold text-whiteSmoke mb-4">
          Change Password
        </h2>
        
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="new-password" className="text-lightGray text-sm block">
              New Password
            </label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-richBlack border-slateBlue/30 focus:border-robinEggBlue text-whiteSmoke"
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="confirm-password" className="text-lightGray text-sm block">
              Confirm New Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-richBlack border-slateBlue/30 focus:border-robinEggBlue text-whiteSmoke"
              placeholder="Confirm new password"
            />
          </div>

          {passwordUpdateSuccess && (
            <div className="flex items-center gap-2 text-green-500 text-sm p-2 rounded-md bg-green-500/10">
              <Check className="w-4 h-4" />
              <span>Password updated successfully!</span>
            </div>
          )}

          {passwordUpdateError && (
            <div className="flex items-center gap-2 text-red-500 text-sm p-2 rounded-md bg-red-500/10">
              <X className="w-4 h-4" />
              <span>{passwordUpdateError}</span>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isUpdating || !newPassword || !confirmPassword}
            className="w-full bg-slateBlue hover:bg-slateBlue/80 text-whiteSmoke"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}
