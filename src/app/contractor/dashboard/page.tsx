'use client'

import { useSession } from 'next-auth/react'
import { RouteGuard } from '@/components/route-guard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserRole } from '@prisma/client'
import { 
  Wrench, 
  DollarSign, 
  Calendar, 
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Navigation
} from 'lucide-react'

export default function ContractorDashboard() {
  const { data: session } = useSession()

  return (
    <RouteGuard allowedRoles={[UserRole.CONTRACTOR]}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contractor Portal</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {session?.user?.name}! Manage your assigned jobs and schedule.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                3 urgent, 2 scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,250</div>
              <p className="text-xs text-muted-foreground">
                12 jobs completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                4.8
                <Star className="h-4 w-4 text-yellow-500 ml-1 fill-current" />
              </div>
              <p className="text-xs text-muted-foreground">
                Based on 24 reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Job</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10:00 AM</div>
              <p className="text-xs text-muted-foreground">
                Manhattan Heights - Plumbing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                Your assigned jobs for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Emergency - Water Leak</h4>
                      <Badge variant="destructive">URGENT</Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <p className="text-sm text-gray-600">
                        Manhattan Heights - Unit 3B
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <p className="text-sm text-gray-600">ASAP</p>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Call Tenant
                      </Button>
                      <Button size="sm" variant="outline">
                        <Navigation className="h-3 w-3 mr-1" />
                        Navigate
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Wrench className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Kitchen Faucet Repair</h4>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Scheduled
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <p className="text-sm text-gray-600">
                        Brooklyn Gardens - Unit 1A
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <p className="text-sm text-gray-600">10:00 AM - 12:00 PM</p>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm">
                        Start Job
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Call Tenant
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Light Fixture Installation</h4>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <p className="text-sm text-gray-600">
                        Queens Plaza - Unit 2C
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <p className="text-sm text-gray-600">Completed at 8:30 AM</p>
                    </div>
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Job completed and invoice submitted
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance & Earnings */}
          <div className="space-y-6">
            {/* This Week's Performance */}
            <Card>
              <CardHeader>
                <CardTitle>This Week's Performance</CardTitle>
                <CardDescription>
                  Your job completion and earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Jobs Completed</span>
                    <span className="text-2xl font-bold">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Earnings</span>
                    <span className="text-2xl font-bold text-green-600">$1,240</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg. Response Time</span>
                    <span className="text-lg font-semibold">45 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer Rating</span>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold mr-1">4.9</span>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    🎉 Great work! You're in the top 10% of contractors this month.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Available Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Available Jobs</CardTitle>
                <CardDescription>
                  New jobs matching your specialties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Toilet Repair</h4>
                      <Badge variant="outline">$150-200</Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <p className="text-sm text-gray-600">Manhattan Heights</p>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm">Accept Job</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Sink Installation</h4>
                      <Badge variant="outline">$300-400</Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <p className="text-sm text-gray-600">Brooklyn Gardens</p>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm">Accept Job</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View All Available Jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Clock className="h-6 w-6" />
                <span>Update Availability</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <DollarSign className="h-6 w-6" />
                <span>Submit Invoice</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Star className="h-6 w-6" />
                <span>View Reviews</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Wrench className="h-6 w-6" />
                <span>Job History</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  )
}

