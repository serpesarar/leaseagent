'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RouteGuard } from '@/components/route-guard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { propertyAPI } from '@/lib/api-client'
import { UserRole, PropertyType } from '@prisma/client'
import { ArrowLeft, Plus, X } from 'lucide-react'

const propertySchema = z.object({
  name: z.string().min(2, 'Property name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().length(2, 'State must be 2 characters (e.g., NY)'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  type: z.nativeEnum(PropertyType),
  totalUnits: z.number().min(1, 'Must have at least 1 unit'),
  yearBuilt: z.number().min(1800).max(new Date().getFullYear()).optional(),
  description: z.string().optional(),
  amenities: z.array(z.string()).default([])
})

type PropertyFormData = z.infer<typeof propertySchema>

const propertyTypes = [
  { value: PropertyType.APARTMENT, label: 'Apartment Complex' },
  { value: PropertyType.HOUSE, label: 'Single Family House' },
  { value: PropertyType.CONDO, label: 'Condominium' },
  { value: PropertyType.COMMERCIAL, label: 'Commercial Property' }
]

const commonAmenities = [
  'Parking', 'Gym', 'Pool', 'Laundry', 'Elevator', 'Balcony', 
  'Air Conditioning', 'Heating', 'Pet Friendly', 'Storage', 
  'Security', 'Concierge', 'Rooftop', 'Garden'
]

export default function CreatePropertyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [customAmenity, setCustomAmenity] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      amenities: []
    }
  })

  const watchedType = watch('type')

  const addAmenity = (amenity: string) => {
    if (!selectedAmenities.includes(amenity)) {
      const newAmenities = [...selectedAmenities, amenity]
      setSelectedAmenities(newAmenities)
      setValue('amenities', newAmenities)
    }
  }

  const removeAmenity = (amenity: string) => {
    const newAmenities = selectedAmenities.filter(a => a !== amenity)
    setSelectedAmenities(newAmenities)
    setValue('amenities', newAmenities)
  }

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      addAmenity(customAmenity.trim())
      setCustomAmenity('')
    }
  }

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await propertyAPI.createProperty(data)
      
      if (response.success) {
        toast({
          title: 'Property created successfully',
          description: `${data.name} has been added to your portfolio.`
        })
        router.push('/dashboard/properties')
      } else {
        throw new Error(response.error || 'Failed to create property')
      }
    } catch (error) {
      console.error('Error creating property:', error)
      toast({
        title: 'Error creating property',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RouteGuard allowedRoles={[UserRole.COMPANY_OWNER, UserRole.PROPERTY_MANAGER]}>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Property</h1>
            <p className="text-muted-foreground">
              Create a new property in your portfolio
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details about your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Property Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="e.g., Manhattan Heights"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Property Type *</Label>
                  <Select onValueChange={(value) => setValue('type', value as PropertyType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-destructive">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="e.g., 123 Main Street"
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="e.g., New York"
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    {...register('state')}
                    placeholder="e.g., NY"
                    maxLength={2}
                  />
                  {errors.state && (
                    <p className="text-sm text-destructive">{errors.state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    {...register('zipCode')}
                    placeholder="e.g., 10001"
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-destructive">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>
                Additional information about your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalUnits">Total Units *</Label>
                  <Input
                    id="totalUnits"
                    type="number"
                    min="1"
                    {...register('totalUnits', { valueAsNumber: true })}
                    placeholder="e.g., 50"
                  />
                  {errors.totalUnits && (
                    <p className="text-sm text-destructive">{errors.totalUnits.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    {...register('yearBuilt', { valueAsNumber: true })}
                    placeholder="e.g., 2015"
                  />
                  {errors.yearBuilt && (
                    <p className="text-sm text-destructive">{errors.yearBuilt.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe your property..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>
                Select the amenities available at your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Amenities */}
              {selectedAmenities.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedAmenities.map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeAmenity(amenity)}
                      >
                        {amenity}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Amenities */}
              <div className="space-y-2">
                <Label>Common Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {commonAmenities.map((amenity) => (
                    <Button
                      key={amenity}
                      type="button"
                      variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                      size="sm"
                      onClick={() => 
                        selectedAmenities.includes(amenity) 
                          ? removeAmenity(amenity)
                          : addAmenity(amenity)
                      }
                    >
                      {amenity}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amenity */}
              <div className="space-y-2">
                <Label>Add Custom Amenity</Label>
                <div className="flex space-x-2">
                  <Input
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    placeholder="Enter custom amenity"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                  />
                  <Button
                    type="button"
                    onClick={addCustomAmenity}
                    disabled={!customAmenity.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Property'}
            </Button>
          </div>
        </form>
      </div>
    </RouteGuard>
  )
}

