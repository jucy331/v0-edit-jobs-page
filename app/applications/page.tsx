"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, DollarSign, Search, Filter } from "lucide-react"
import Link from "next/link"

export default function ApplicationsPage() {
  const { userProfile, loading } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const applications = [
    {
      id: "1",
      jobTitle: "Product Survey Tester",
      company: "Market Research Co.",
      status: "accepted",
      appliedDate: "2024-01-15",
      earnings: 45.0,
      description: "Complete surveys about consumer products and services",
      category: "Surveys & Market Research",
    },
    {
      id: "2",
      jobTitle: "AI Training Data Specialist",
      company: "TechCorp AI",
      status: "pending",
      appliedDate: "2024-01-14",
      earnings: 0,
      description: "Label data and provide feedback for AI training",
      category: "AI & Machine Learning",
    },
    {
      id: "3",
      jobTitle: "Virtual Assistant",
      company: "StartupXYZ",
      status: "completed",
      appliedDate: "2024-01-12",
      earnings: 120.0,
      description: "Administrative support and email management",
      category: "Virtual Assistance",
    },
    {
      id: "4",
      jobTitle: "Content Moderator",
      company: "Social Platform Inc.",
      status: "in_progress",
      appliedDate: "2024-01-10",
      earnings: 80.5,
      description: "Review and moderate user-generated content",
      category: "Social Media & Moderation",
    },
    {
      id: "5",
      jobTitle: "Audio Transcription Specialist",
      company: "Media Corp",
      status: "rejected",
      appliedDate: "2024-01-08",
      earnings: 0,
      description: "Transcribe audio recordings to text",
      category: "Transcription & Translation",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepted"
      case "pending":
        return "Pending Review"
      case "completed":
        return "Completed"
      case "in_progress":
        return "In Progress"
      case "rejected":
        return "Not Selected"
      default:
        return "Unknown"
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const groupedApplications = {
    active: filteredApplications.filter((app) => ["pending", "accepted", "in_progress"].includes(app.status)),
    completed: filteredApplications.filter((app) => app.status === "completed"),
    rejected: filteredApplications.filter((app) => app.status === "rejected"),
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading applications...</div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your applications.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-2">Track and manage your job applications</p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Not Selected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({groupedApplications.active.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({groupedApplications.completed.length})</TabsTrigger>
          <TabsTrigger value="rejected">Not Selected ({groupedApplications.rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {groupedApplications.active.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600">No active applications found.</p>
                <Link href="/jobs">
                  <Button className="mt-4">Browse Jobs</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            groupedApplications.active.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {groupedApplications.completed.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600">No completed applications found.</p>
              </CardContent>
            </Card>
          ) : (
            groupedApplications.completed.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {groupedApplications.rejected.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600">No rejected applications found.</p>
              </CardContent>
            </Card>
          ) : (
            groupedApplications.rejected.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApplicationCard({ application }: { application: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepted"
      case "pending":
        return "Pending Review"
      case "completed":
        return "Completed"
      case "in_progress":
        return "In Progress"
      case "rejected":
        return "Not Selected"
      default:
        return "Unknown"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{application.jobTitle}</CardTitle>
            <CardDescription>{application.company}</CardDescription>
          </div>
          <Badge className={getStatusColor(application.status)}>{getStatusText(application.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{application.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Applied: {application.appliedDate}
          </div>
          <div className="flex items-center">
            <Badge variant="outline">{application.category}</Badge>
          </div>
          {application.earnings > 0 && (
            <div className="flex items-center text-green-600 font-medium">
              <DollarSign className="h-4 w-4 mr-1" />${application.earnings.toFixed(2)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
