'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { RouteGuard } from '@/components/route-guard'
import { UserRole, MaintenanceStatus, IssueSeverity, IssueCategory } from '@prisma/client'
import { CameraCapture } from '@/components/camera-capture'
import {
  Plus,
  Wrench,
  Clock,
  CheckCircle,
  AlertTriangle,
  Camera,
  FileText,
  Phone,
  X
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const maintenanceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.nativeEnum(IssueCategory),
  severity: z.nativeEnum(IssueSeverity),
  location: z.string().min(2, 'Location is required'),
  preferredTime: z.string().optional(),
  allowEntry: z.boolean().default(true),
  contactPhone: z.string().optional(),
  images: z.array(z.string()).default([])
})

type MaintenanceFormData = z.infer<typeof maintenanceSchema>

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  category: IssueCategory
  severity: IssueSeverity
  status: MaintenanceStatus
  location: string
  createdAt: string
  updatedAt: string
  images: string[]
  contractor?: {
    id: string
    name: string
    phone: string
  }
  scheduledDate?: string
  completedAt?: string
  estimatedCost?: number
  notes?: string
}

// Mock data
const mockRequests: MaintenanceRequest[] = [
  {
    id: '1',
    title: 'Kitchen Faucet Leak',
    description: 'The kitchen faucet has been dripping constantly for the past two days. Water is pooling under the sink.',
    category: IssueCategory.PLUMBING,
    severity: IssueSeverity.MEDIUM,
    status: MaintenanceStatus.IN_PROGRESS,
    location: 'Kitchen',
    createdAt: '2024-09-20T10:30:00Z',
    updatedAt: '2024-09-21T09:15:00Z',
    images: [],
    contractor: {
      id: '1',
      name: 'Elite Plumbing Services',
      phone: '+1 (555) 123-PIPE'
    },
    scheduledDate: '2024-09-22T14:00:00Z',
    estimatedCost: 150
  },
  {
    id: '2',
    title: 'Air Conditioning Not Cooling',
    description: 'AC unit stopped working yesterday. Room temperature is getting uncomfortable.',
    category: IssueCategory.APPLIANCE,
    severity: IssueSeverity.HIGH,
    status: MaintenanceStatus.PENDING,
    location: 'Living Room',
    createdAt: '2024-09-19T16:45:00Z',
    updatedAt: '2024-09-19T16:45:00Z',
    images: []
  },
  {
    id: '3',
    title: 'Bathroom Light Bulb Replacement',
    description: 'Light bulb in master bathroom burned out.',
    category: IssueCategory.ELECTRICAL,
    severity: IssueSeverity.LOW,
    status: MaintenanceStatus.COMPLETED,
    location: 'Master Bathroom',
    createdAt: '2024-09-15T08:20:00Z',
    updatedAt: '2024-09-16T11:30:00Z',
    images: [],
    completedAt: '2024-09-16T11:30:00Z',
    estimatedCost: 25
  }
]

const categoryLabels = {
  [IssueCategory.PLUMBING]: 'Plumbing',
  [IssueCategory.ELECTRICAL]: 'Electrical',
  [IssueCategory.APPLIANCE]: 'Appliance',
  [IssueCategory.STRUCTURAL]: 'Structural',
  [IssueCategory.HVAC]: 'HVAC',
  [IssueCategory.GENERAL]: 'General'
}

const severityLabels = {
  [IssueSeverity.LOW]: 'Low',
  [IssueSeverity.MEDIUM]: 'Medium',
  [IssueSeverity.HIGH]: 'High',
  [IssueSeverity.URGENT]: 'Urgent'
}

export default function TenantMaintenancePage() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [capturedImages, setCapturedImages] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      allowEntry: true,
      images: []
    }
  })

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setRequests(mockRequests)
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast({
        title: 'Error loading requests',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: MaintenanceFormData) => {
    setIsSubmitting(true)
    
    try {
      // Add captured images to form data
      const requestData = {
        ...data,
        images: capturedImages
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create new request
      const newRequest: MaintenanceRequest = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        category: data.category,
        severity: data.severity,
        status: MaintenanceStatus.PENDING,
        location: data.location,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: capturedImages
      }

      setRequests(prev => [newRequest, ...prev])
      
      toast({
        title: 'Maintenance request submitted',
        description: 'We\'ll review your request and assign a contractor soon.'
      })
      
      // Reset form and close dialog
      reset()
      setCapturedImages([])
      setShowCreateDialog(false)
      
    } catch (error) {
      console.error('Error submitting request:', error)
      toast({
        title: 'Error submitting request',
        description: 'Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageCapture = (imageData: string) => {
    setCapturedImages(prev => [...prev, imageData])
    setValue('images', [...capturedImages, imageData])
  }

  const removeImage = (index: number) => {
    const newImages = capturedImages.filter((_, i) => i !== index)
    setCapturedImages(newImages)
    setValue('images', newImages)
  }

  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case MaintenanceStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800'
      case MaintenanceStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case MaintenanceStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: IssueSeverity) => {
    switch (severity) {
      case IssueSeverity.LOW:
        return 'bg-green-100 text-green-800'
      case IssueSeverity.MEDIUM:
        return 'bg-yellow-100 text-yellow-800'
      case IssueSeverity.HIGH:
        return 'bg-orange-100 text-orange-800'
      case IssueSeverity.URGENT:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.PENDING:
        return <Clock className="h-4 w-4" />
      case MaintenanceStatus.IN_PROGRESS:
        return <Wrench className="h-4 w-4" />
      case MaintenanceStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4" />
      case MaintenanceStatus.CANCELLED:
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const activeRequests = requests.filter(r => 
    r.status === MaintenanceStatus.PENDING || r.status === MaintenanceStatus.IN_PROGRESS
  )
  
  const completedRequests = requests.filter(r => 
    r.status === MaintenanceStatus.COMPLETED || r.status === MaintenanceStatus.CANCELLED
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <RouteGuard allowedRoles={[UserRole.TENANT]}>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
            <p className="text-gray-600 mt-1">
              Submit and track maintenance requests for your unit
            </p>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Maintenance Request</DialogTitle>
                <DialogDescription>
                  Describe the issue and we'll assign a contractor to help you.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="e.g., Kitchen faucet leaking"
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      {...register('location')}
                      placeholder="e.g., Kitchen, Bathroom, Living Room"
                    />
                    {errors.location && (
                      <p className="text-sm text-destructive">{errors.location.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setValue('category', value as IssueCategory)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Priority *</Label>
                    <Select onValueChange={(value) => setValue('severity', value as IssueSeverity)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(severityLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.severity && (
                      <p className="text-sm text-destructive">{errors.severity.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Please provide details about the issue..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Time</Label>
                    <Input
                      id="preferredTime"
                      {...register('preferredTime')}
                      placeholder="e.g., Weekdays 9-5, Anytime"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      {...register('contactPhone')}
                      placeholder="Optional contact number"
                    />
                  </div>
                </div>

                {/* Image Capture */}
                <div className="space-y-4">
                  <Label>Photos (Optional)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CameraCapture
                      onCapture={handleImageCapture}
                      className="h-40"
                    />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Take photos to help contractors understand the issue better.
                      </p>
                      {capturedImages.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Captured Photos:</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {capturedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image}
                                  alt={`Captured ${index + 1}`}
                                  className="w-full h-20 object-cover rounded border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Allow Entry Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowEntry"
                    {...register('allowEntry')}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="allowEntry" className="text-sm">
                    Allow contractors to enter my unit if I'm not home
                  </Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Request Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">
              Active Requests ({activeRequests.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No active requests</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any pending maintenance requests.
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getStatusIcon(request.status)}
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(request.severity)}>
                            {severityLabels[request.severity]}
                          </Badge>
                          <Badge variant="outline">
                            {categoryLabels[request.category]}
                          </Badge>
                          <span className="text-sm text-gray-500">• {request.location}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{request.description}</p>
                    
                    {request.contractor && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-blue-900">Assigned Contractor</p>
                            <p className="text-sm text-blue-700">{request.contractor.name}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            {request.contractor.phone}
                          </Button>
                        </div>
                      </div>
                    )}

                    {request.scheduledDate && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-900">Scheduled Service</p>
                        <p className="text-sm text-green-700">
                          {new Date(request.scheduledDate).toLocaleDateString()} at{' '}
                          {new Date(request.scheduledDate).toLocaleTimeString()}
                        </p>
                      </div>
                    )}

                    {request.estimatedCost && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Estimated Cost:</span>
                        <span className="font-semibold">${request.estimatedCost}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <span>Submitted: {new Date(request.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(request.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No completed requests</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your completed maintenance requests will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedRequests.map((request) => (
                <Card key={request.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getStatusIcon(request.status)}
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(request.severity)}>
                            {severityLabels[request.severity]}
                          </Badge>
                          <Badge variant="outline">
                            {categoryLabels[request.category]}
                          </Badge>
                          <span className="text-sm text-gray-500">• {request.location}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-gray-600 text-sm">{request.description}</p>
                    
                    {request.completedAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Completed:</span>
                        <span>{new Date(request.completedAt).toLocaleDateString()}</span>
                      </div>
                    )}

                    {request.estimatedCost && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Cost:</span>
                        <span className="font-semibold">${request.estimatedCost}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </RouteGuard>
  )
}

