'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  ArrowLeft,
  Upload,
  Zap,
  DollarSign,
  User,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react'

// Mock data
const mockProperties = [
  { id: '1', name: 'Manhattan Heights', address: '456 Park Avenue' },
  { id: '2', name: 'Brooklyn Commons', address: '789 Atlantic Avenue' },
  { id: '3', name: 'Queens Garden Apartments', address: '321 Northern Boulevard' }
]

const mockUnits = {
  '1': [
    { id: '1', number: '1A', tenant: 'John Smith' },
    { id: '2', number: '2B', tenant: 'Mike Davis' },
    { id: '3', number: '3C', tenant: 'Sarah Chen' }
  ],
  '2': [
    { id: '4', number: '1A', tenant: 'Emily Wilson' },
    { id: '5', number: '2A', tenant: 'David Brown' }
  ]
}

export default function CreateMaintenanceRequestPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyId: '',
    unitId: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    images: [] as File[]
  })
  
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableUnits, setAvailableUnits] = useState<any[]>([])

  useEffect(() => {
    if (formData.propertyId) {
      setAvailableUnits(mockUnits[formData.propertyId as keyof typeof mockUnits] || [])
    }
  }, [formData.propertyId])

  // AI Analysis when title and description are provided
  useEffect(() => {
    const analyzeIssue = async () => {
      if (formData.title.length > 5 && formData.description.length > 10) {
        setIsAnalyzing(true)
        
        try {
          // Simulate AI analysis
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Mock AI response based on keywords
          const text = `${formData.title} ${formData.description}`.toLowerCase()
          let category = 'GENERAL'
          let severity = 'MEDIUM'
          let estimatedCost = 150
          let suggestedContractor = null

          if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('faucet')) {
            category = 'PLUMBING'
            estimatedCost = 250
            suggestedContractor = 'Elite Plumbing Services'
          } else if (text.includes('electric') || text.includes('outlet') || text.includes('light') || text.includes('power')) {
            category = 'ELECTRICAL'
            estimatedCost = 300
            suggestedContractor = 'NYC Electrical Solutions'
          } else if (text.includes('heat') || text.includes('ac') || text.includes('hvac') || text.includes('air condition')) {
            category = 'HVAC'
            estimatedCost = 400
          }

          if (text.includes('emergency') || text.includes('urgent') || text.includes('flooding') || text.includes('no heat')) {
            severity = 'URGENT'
            estimatedCost *= 1.5
          } else if (text.includes('broken') || text.includes('not working') || text.includes('stopped')) {
            severity = 'HIGH'
            estimatedCost *= 1.2
          }

          setAiAnalysis({
            category,
            severity,
            estimatedCost: Math.round(estimatedCost),
            suggestedContractor,
            confidence: 0.85,
            reasoning: `Based on the description, this appears to be a ${category.toLowerCase()} issue with ${severity.toLowerCase()} priority.`
          })
        } catch (error) {
          console.error('AI analysis failed:', error)
        } finally {
          setIsAnalyzing(false)
        }
      }
    }

    const debounceTimer = setTimeout(analyzeIssue, 1000)
    return () => clearTimeout(debounceTimer)
  }, [formData.title, formData.description])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: 'Maintenance Request Created',
        description: `Your request has been submitted and ${aiAnalysis?.suggestedContractor ? 'automatically assigned to ' + aiAnalysis.suggestedContractor : 'is being processed'}.`
      })
      
      router.push('/maintenance')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create maintenance request. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedProperty = mockProperties.find(p => p.id === formData.propertyId)
  const selectedUnit = availableUnits.find(u => u.id === formData.unitId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Maintenance Request</h1>
          <p className="text-gray-600 mt-1">
            Submit a new maintenance request with AI-powered issue analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Issue Details</CardTitle>
                <CardDescription>
                  Describe the maintenance issue in detail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Issue Title *</label>
                  <Input
                    placeholder="e.g., Leaky faucet in kitchen"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                    placeholder="Provide detailed description of the issue, including when it started, severity, and any other relevant information..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.propertyId}
                      onChange={(e) => handleInputChange('propertyId', e.target.value)}
                      required
                    >
                      <option value="">Select Property</option>
                      {mockProperties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name} - {property.address}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Unit</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.unitId}
                      onChange={(e) => handleInputChange('unitId', e.target.value)}
                      disabled={!formData.propertyId}
                    >
                      <option value="">Select Unit (Optional)</option>
                      {availableUnits.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          Unit {unit.number} - {unit.tenant}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority Level</label>
                  <div className="flex space-x-2">
                    {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          formData.priority === priority
                            ? priority === 'URGENT' ? 'bg-red-100 text-red-800 border-red-300' :
                              priority === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                              priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                              'bg-green-100 text-green-800 border-green-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        } border`}
                        onClick={() => handleInputChange('priority', priority)}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
                <CardDescription>
                  Upload photos to help contractors understand the issue better
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload photos
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB each
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>

                  {/* Uploaded Images */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.description || !formData.propertyId}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Request...
                  </>
                ) : (
                  'Create Request'
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* AI Analysis Sidebar */}
        <div className="space-y-6">
          {/* Request Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedProperty && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{selectedProperty.name}</p>
                    <p className="text-sm text-gray-500">{selectedProperty.address}</p>
                  </div>
                </div>
              )}
              
              {selectedUnit && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Unit {selectedUnit.number}</p>
                    <p className="text-sm text-gray-500">{selectedUnit.tenant}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Priority</p>
                  <Badge variant={
                    formData.priority === 'URGENT' ? 'destructive' :
                    formData.priority === 'HIGH' ? 'default' : 'outline'
                  }>
                    {formData.priority}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span>AI Analysis</span>
              </CardTitle>
              <CardDescription>
                Smart categorization and cost estimation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing issue...</span>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {aiAnalysis.category}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Severity</p>
                    <Badge variant={
                      aiAnalysis.severity === 'URGENT' ? 'destructive' :
                      aiAnalysis.severity === 'HIGH' ? 'default' : 'outline'
                    }>
                      {aiAnalysis.severity}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Estimated Cost</p>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        ${aiAnalysis.estimatedCost}
                      </span>
                    </div>
                  </div>

                  {aiAnalysis.suggestedContractor && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Suggested Contractor</p>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-purple-600" />
                        <span className="text-purple-600 font-medium">
                          {aiAnalysis.suggestedContractor}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Analysis</p>
                    <p className="text-sm text-gray-600">{aiAnalysis.reasoning}</p>
                  </div>

                  <div className="text-xs text-gray-500">
                    Confidence: {(aiAnalysis.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Start typing to get AI-powered analysis and cost estimation
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

