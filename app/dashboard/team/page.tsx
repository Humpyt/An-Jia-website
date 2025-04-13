"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Mail, Phone, MoreVertical, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+256 700 123 456",
      role: "Admin",
      properties: 12,
      avatar: "/placeholder.svg?text=JD",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+256 701 234 567",
      role: "Agent",
      properties: 8,
      avatar: "/placeholder.svg?text=JS",
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "+256 702 345 678",
      role: "Agent",
      properties: 5,
      avatar: "/placeholder.svg?text=MJ",
    },
  ])

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Agent",
  })

  const [editMember, setEditMember] = useState<any | null>(null)
  const [deleteMember, setDeleteMember] = useState<any | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMember({
      ...newMember,
      [e.target.name]: e.target.value,
    })
  }

  const handleEditMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditMember({
      ...editMember,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      const id = Math.random().toString(36).substring(2, 9)
      setTeamMembers([
        ...teamMembers,
        {
          id,
          ...newMember,
          properties: 0,
          avatar: `/placeholder.svg?text=${newMember.name.charAt(0)}${newMember.name.split(" ")[1]?.charAt(0) || ""}`,
        },
      ])
      setNewMember({
        name: "",
        email: "",
        phone: "",
        role: "Agent",
      })
      setIsSubmitting(false)
      toast({
        title: "Team member added",
        description: "The team member has been added successfully",
      })
    }, 1000)
  }

  const handleUpdateMember = () => {
    if (!editMember || !editMember.name || !editMember.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setTeamMembers(teamMembers.map((member) => (member.id === editMember.id ? editMember : member)))
      setEditMember(null)
      setIsSubmitting(false)
      toast({
        title: "Team member updated",
        description: "The team member has been updated successfully",
      })
    }, 1000)
  }

  const handleDeleteMember = () => {
    if (!deleteMember) return

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setTeamMembers(teamMembers.filter((member) => member.id !== deleteMember.id))
      setDeleteMember(null)
      setIsSubmitting(false)
      toast({
        title: "Team member deleted",
        description: "The team member has been deleted successfully",
      })
    }, 1000)
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Team</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>Add a new team member to your account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newMember.name}
                  onChange={handleNewMemberChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newMember.email}
                  onChange={handleNewMemberChange}
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newMember.phone}
                  onChange={handleNewMemberChange}
                  placeholder="+256 700 123 456"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Admin">Admin</option>
                  <option value="Agent">Agent</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddMember} disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Team Member"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="agent">Agents</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team members and their access.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Role</th>
                      <th className="py-3 px-4 text-left font-medium">Properties</th>
                      <th className="py-3 px-4 text-left font-medium">Contact</th>
                      <th className="py-3 px-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-xs text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{member.role}</td>
                        <td className="py-3 px-4">{member.properties}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Mail className="h-4 w-4" />
                              <span className="sr-only">Email</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Phone className="h-4 w-4" />
                              <span className="sr-only">Call</span>
                            </Button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setEditMember(member)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeleteMember(member)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admins</CardTitle>
              <CardDescription>Team members with admin access.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Properties</th>
                      <th className="py-3 px-4 text-left font-medium">Contact</th>
                      <th className="py-3 px-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers
                      .filter((member) => member.role === "Admin")
                      .map((member) => (
                        <tr key={member.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-xs text-muted-foreground">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{member.properties}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Email</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Phone className="h-4 w-4" />
                                <span className="sr-only">Call</span>
                              </Button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setEditMember(member)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setDeleteMember(member)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="agent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agents</CardTitle>
              <CardDescription>Team members with agent access.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Properties</th>
                      <th className="py-3 px-4 text-left font-medium">Contact</th>
                      <th className="py-3 px-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers
                      .filter((member) => member.role === "Agent")
                      .map((member) => (
                        <tr key={member.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-xs text-muted-foreground">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{member.properties}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Email</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Phone className="h-4 w-4" />
                                <span className="sr-only">Call</span>
                              </Button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setEditMember(member)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setDeleteMember(member)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Member Dialog */}
      <Dialog open={!!editMember} onOpenChange={(open) => !open && setEditMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update team member information.</DialogDescription>
          </DialogHeader>
          {editMember && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" name="name" value={editMember.name} onChange={handleEditMemberChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editMember.email}
                  onChange={handleEditMemberChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" name="phone" value={editMember.phone} onChange={handleEditMemberChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <select
                  id="edit-role"
                  name="role"
                  value={editMember.role}
                  onChange={(e) => setEditMember({ ...editMember, role: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Admin">Admin</option>
                  <option value="Agent">Agent</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMember(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMember} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Member Dialog */}
      <Dialog open={!!deleteMember} onOpenChange={(open) => !open && setDeleteMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteMember?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteMember(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
