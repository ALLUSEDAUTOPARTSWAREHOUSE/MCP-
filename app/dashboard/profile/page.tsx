'use client'

import { useSession } from '@/lib/auth-client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, User, Phone, MapPin, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setProfile((prev) => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }))
      // Fetch extended profile data
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching profile:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('[v0] Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-foreground/60">Manage your account information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} size="lg">
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Info */}
      <div className="grid gap-6">
        <div className="p-6 border border-white/10 rounded-lg bg-white/5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-foreground/60 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            {isEditing ? (
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            ) : (
              <p className="font-semibold">{profile.name || 'Not set'}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-foreground/60 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <p className="font-semibold">{profile.email}</p>
            <p className="text-xs text-foreground/60 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-foreground/60 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone
            </label>
            {isEditing ? (
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            ) : (
              <p className="font-semibold">{profile.phone || 'Not set'}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-foreground/60 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </label>
            {isEditing ? (
              <>
                <Input
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Street address"
                  className="mb-2"
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="City"
                  />
                  <Input
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    placeholder="State"
                    maxLength={2}
                  />
                  <Input
                    value={profile.zip}
                    onChange={(e) => setProfile({ ...profile, zip: e.target.value })}
                    placeholder="ZIP"
                  />
                </div>
              </>
            ) : (
              <p className="font-semibold">
                {profile.address ? (
                  <>
                    {profile.address}
                    <br />
                    {profile.city}, {profile.state} {profile.zip}
                  </>
                ) : (
                  'Not set'
                )}
              </p>
            )}
          </div>
        </div>

        {/* Member Since */}
        <div className="p-4 border border-white/10 rounded-lg bg-white/5 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-foreground/60" />
          <div>
            <p className="text-sm text-foreground/60">Member since</p>
            <p className="font-semibold">
              {session?.user?.createdAt
                ? new Date(session.user.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-4">
            <Button size="lg" onClick={handleSave} disabled={isSaving} className="flex-1">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
