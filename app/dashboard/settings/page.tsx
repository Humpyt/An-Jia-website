"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+256 700 123 456",
    company: "An Jia You Xuan",
    bio: "Real estate professional with over 5 years of experience in the Kampala market.",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newInquiries: true,
    propertyViews: true,
    marketingUpdates: false,
  })

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleNotificationChange = (key: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key as keyof typeof notificationSettings],
    })
  }

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityForm({
      ...securityForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    }, 1000)
  }

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Notification settings updated",
        description: "Your notification settings have been updated successfully",
      })
    }, 1000)
  }

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      })
    }, 1000)
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your profile information.</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg?text=JD" alt="John Doe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={profileForm.phone} onChange={handleProfileChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" value={profileForm.company} onChange={handleProfileChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={profileForm.bio} onChange={handleProfileChange} rows={4} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences.</CardDescription>
            </CardHeader>
            <form onSubmit={handleNotificationsSubmit}>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={() => handleNotificationChange("emailNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <div className="text-sm text-muted-foreground">Receive notifications via SMS</div>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notificationSettings.smsNotifications}
                    onChange={() => handleNotificationChange("smsNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-inquiries">New Inquiries</Label>
                    <div className="text-sm text-muted-foreground">Get notified when you receive new inquiries</div>
                  </div>
                  <Switch
                    id="new-inquiries"
                    checked={notificationSettings.newInquiries}
                    onChange={() => handleNotificationChange("newInquiries")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="property-views">Property Views</Label>
                    <div className="text-sm text-muted-foreground">Get notified when your properties are viewed</div>
                  </div>
                  <Switch
                    id="property-views"
                    checked={notificationSettings.propertyViews}
                    onChange={() => handleNotificationChange("propertyViews")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-updates">Marketing Updates</Label>
                    <div className="text-sm text-muted-foreground">Receive marketing updates and newsletters</div>
                  </div>
                  <Switch
                    id="marketing-updates"
                    checked={notificationSettings.marketingUpdates}
                    onChange={() => handleNotificationChange("marketingUpdates")}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security settings.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSecuritySubmit}>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    name="currentPassword"
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={handleSecurityChange}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Sessions</h3>
                  <div className="rounded-md border">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Current Session</div>
                          <div className="text-sm text-muted-foreground">Kampala, Uganda • Chrome on Windows</div>
                        </div>
                        <div className="text-sm text-muted-foreground">Active now</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <Button variant="outline" size="sm">
                        Sign Out All Devices
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Manage your billing information and subscription.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Current Plan</h3>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Professional Plan</div>
                      <div className="text-sm text-muted-foreground">$29.99/month • Renews on November 1, 2023</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Plan
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Payment Method</h3>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 rounded-md bg-muted flex items-center justify-center">
                        <span className="font-medium">VISA</span>
                      </div>
                      <div>
                        <div className="font-medium">Visa ending in 4242</div>
                        <div className="text-sm text-muted-foreground">Expires 12/2024</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Billing History</h3>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Date</th>
                        <th className="py-3 px-4 text-left font-medium">Amount</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-right font-medium">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">Oct 1, 2023</td>
                        <td className="py-3 px-4">$29.99</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            Paid
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Sep 1, 2023</td>
                        <td className="py-3 px-4">$29.99</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            Paid
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
