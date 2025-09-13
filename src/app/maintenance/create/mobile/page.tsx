'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TouchButton, PullToRefresh, ActionSheet } from '@/components/touch-optimized-ui'
import { PhotoUpload } from '@/components/camera-capture'
import { MobileTopBar } from '@/components/mobile-navigation'
import { useToast } from '@/hooks/use-toast'
import { 
  ArrowLeft, 
  Send, 
  MapPin, 
  AlertTriangle,
  Wrench,
  Clock,
  MoreVertical
} from 'lucide-react'

interface MaintenanceFormData {
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: string
  propertyId: string
  unitNumber: string
  location: string
  photos: File[]
}

const priorityOptions = [
  { value: 'LOW', label: 'Low Priority', color: 'text-green-600', icon: Clock },
  { value: 'MEDIUM', label: 'Medium Priority', color: 'text-yellow-600', icon: Clock },
  { value: 'HIGH', label: 'High Priority', color: 'text-orange-600', icon: AlertTriangle },
  { value: 'URGENT', label: 'Urgent', color: 'text-red-600', icon: AlertTriangle },
]

const categoryOptions = [
  'Plumbing',
  'Electrical',
  'HVAC',
  'Appliances',
  'Doors & Windows',
  'Flooring',
  'Painting',
  'Pest Control',
  'Security',
  'Other'
]

const mockProperties = [
  { id: '1', name: 'Manhattan Heights', address: '123 Main St' },
  { id: '2', name: 'Brooklyn Gardens', address: '456 Oak Ave' },
  { id: '3', name: 'Queens Plaza', address: '789 Pine St' },
]

export default function MobileMaintenanceCreatePage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<MaintenanceFormData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: '',
    propertyId: '',
    unitNumber: '',
    location: '',
    photos: []
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [errors, setErrors] = useState<Partial<MaintenanceFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<MaintenanceFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.propertyId) {
      newErrors.propertyId = 'Property is required'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: 'Maintenance request submitted',
        description: 'Your request has been received and assigned a ticket number.',
      })
      
      router.push('/dashboard/maintenance')
    } catch (error) {
      toast({
        title: 'Error submitting request',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotosSelected = (files: File[]) => {
    setFormData(prev => ({ ...prev, photos: files }))
  }

  const handleRefresh = async () => {
    // Refresh form or fetch latest data
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const selectedProperty = mockProperties.find(p => p.id === formData.propertyId)
  const selectedPriority = priorityOptions.find(p => p.value === formData.priority)

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileTopBar />
      
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="p-4 space-y-4 pb-20">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <TouchButton
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </TouchButton>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">New Maintenance Request</h1>
              <p className="text-sm text-gray-500">Submit a new maintenance issue</p>
            </div>
            <TouchButton
              onClick={() => setShowActionSheet(true)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <MoreVertical className="h-5 w-5" />
            </TouchButton>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Title */}
            <Card>
              <CardContent className="p-4">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Issue Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`mt-1 h-12 ${errors.title ? 'border-red-300' : ''}`}
                />
                {errors.title && (
                  <p className="text-xs text-red-600 mt-1">{errors.title}</p>
                )}
              </CardContent>
            </Card>

            {/* Property Selection */}
            <Card>
              <CardContent className="p-4">
                <Label className="text-sm font-medium text-gray-700">
                  Property *
                </Label>
                <Select
                  value={formData.propertyId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, propertyId: value }))}
                >
                  <SelectTrigger className={`mt-1 h-12 ${errors.propertyId ? 'border-red-300' : ''}`}>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        <div>
                          <div className="font-medium">{property.name}</div>
                          <div className="text-sm text-gray-500">{property.address}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyId && (
                  <p className="text-xs text-red-600 mt-1">{errors.propertyId}</p>
                )}
              </CardContent>
            </Card>

            {/* Unit and Location */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label htmlFor="unit" className="text-sm font-medium text-gray-700">
                    Unit Number
                  </Label>
                  <Input
                    id="unit"
                    placeholder="e.g., 2B, 301, etc."
                    value={formData.unitNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Specific Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Kitchen sink, Living room, etc."
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="mt-1 h-12"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category and Priority */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className={`mt-1 h-12 ${errors.category ? 'border-red-300' : ''}`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs text-red-600 mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Priority
                  </Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {priorityOptions.map((option) => {
                      const Icon = option.icon
                      const isSelected = formData.priority === option.value
                      
                      return (
                        <TouchButton
                          key={option.value}
                          onClick={() => setFormData(prev => ({ ...prev, priority: option.value as any }))}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={`justify-start ${isSelected ? '' : option.color}`}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {option.label}
                        </TouchButton>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-4">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Detailed Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue, including what's wrong, when it started, and any other relevant details..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`mt-1 min-h-[120px] resize-none ${errors.description ? 'border-red-300' : ''}`}
                  rows={5}
                />
                {errors.description && (
                  <p className="text-xs text-red-600 mt-1">{errors.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Wrench className="mr-2 h-5 w-5" />
                  Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PhotoUpload
                  onPhotosSelected={handlePhotosSelected}
                  maxPhotos={5}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Add photos to help contractors understand the issue better
                </p>
              </CardContent>
            </Card>

            {/* Summary */}
            {selectedProperty && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Request Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center text-blue-800">
                      <MapPin className="mr-2 h-4 w-4" />
                      {selectedProperty.name}
                      {formData.unitNumber && ` - Unit ${formData.unitNumber}`}
                    </div>
                    {selectedPriority && (
                      <div className={`flex items-center ${selectedPriority.color}`}>
                        <selectedPriority.icon className="mr-2 h-4 w-4" />
                        {selectedPriority.label}
                      </div>
                    )}
                    {formData.photos.length > 0 && (
                      <p className="text-blue-700">
                        {formData.photos.length} photo{formData.photos.length !== 1 ? 's' : ''} attached
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </PullToRefresh>

      {/* Fixed Bottom Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <TouchButton
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Request
            </>
          )}
        </TouchButton>
      </div>

      {/* Action Sheet */}
      <ActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        title="Options"
        actions={[
          {
            label: 'Save as Draft',
            icon: Clock,
            onClick: () => {
              toast({ title: 'Draft saved' })
            }
          },
          {
            label: 'Clear Form',
            icon: AlertTriangle,
            onClick: () => {
              setFormData({
                title: '',
                description: '',
                priority: 'MEDIUM',
                category: '',
                propertyId: '',
                unitNumber: '',
                location: '',
                photos: []
              })
              toast({ title: 'Form cleared' })
            },
            destructive: true
          }
        ]}
      />
    </div>
  )
}

