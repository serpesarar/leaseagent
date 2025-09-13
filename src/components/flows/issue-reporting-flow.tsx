'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
  Plus,
  Droplets,
  Zap,
  Wrench,
  CreditCard,
  HelpCircle,
  Camera,
  Upload,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Send,
  Eye,
  Edit3
} from 'lucide-react'

// Sorun kategorileri
const ISSUE_CATEGORIES = [
  {
    id: 'plumbing',
    label: 'Su Tesisatı',
    icon: Droplets,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
    description: 'Musluk, lavabo, tuvalet, su sızıntısı'
  },
  {
    id: 'electrical',
    label: 'Elektrik',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    description: 'Elektrik kesintisi, priz, anahtar, aydınlatma'
  },
  {
    id: 'repair',
    label: 'Tamir',
    icon: Wrench,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
    borderColor: 'border-green-200 dark:border-green-800',
    description: 'Kapı, pencere, mobilya, genel tamir'
  },
  {
    id: 'payment',
    label: 'Ödeme',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-200 dark:border-purple-800',
    description: 'Kira ödemesi, faturalar, ödeme sorunları'
  },
  {
    id: 'other',
    label: 'Diğer',
    icon: HelpCircle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950',
    borderColor: 'border-gray-200 dark:border-gray-800',
    description: 'Diğer konular ve genel sorular'
  }
]

// Aciliyet seviyeleri
const PRIORITY_LEVELS = [
  {
    id: 'low',
    label: 'Düşük',
    description: 'Acil değil, bekleyebilir',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
    icon: Clock,
    estimatedTime: '1-2 hafta'
  },
  {
    id: 'medium',
    label: 'Orta',
    description: 'Normal öncelik',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    icon: Clock,
    estimatedTime: '3-5 gün'
  },
  {
    id: 'high',
    label: 'Yüksek',
    description: 'Önemli, hızlı çözüm gerekli',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    icon: AlertTriangle,
    estimatedTime: '1-2 gün'
  },
  {
    id: 'urgent',
    label: 'Acil',
    description: 'Acil müdahale gerekli',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950',
    icon: AlertTriangle,
    estimatedTime: 'Aynı gün'
  }
]

// AI önerileri (mock data)
const AI_SUGGESTIONS = {
  plumbing: {
    title: 'Su Tesisatı Sorunu',
    description: 'Musluk tamiri veya su sızıntısı',
    assignedTo: 'Ahmet Usta',
    estimatedTime: '2-3 gün',
    estimatedCost: '₺150-300',
    confidence: 85
  },
  electrical: {
    title: 'Elektrik Sorunu',
    description: 'Elektrik kesintisi veya priz sorunu',
    assignedTo: 'Mehmet Elektrikçi',
    estimatedTime: '1-2 gün',
    estimatedCost: '₺200-500',
    confidence: 90
  },
  repair: {
    title: 'Genel Tamir',
    description: 'Kapı, pencere veya mobilya tamiri',
    assignedTo: 'Ali Tamirci',
    estimatedTime: '3-5 gün',
    estimatedCost: '₺100-400',
    confidence: 75
  },
  payment: {
    title: 'Ödeme Sorunu',
    description: 'Kira ödemesi veya fatura sorunu',
    assignedTo: 'Muhasebe Departmanı',
    estimatedTime: '1 gün',
    estimatedCost: 'Ücretsiz',
    confidence: 95
  },
  other: {
    title: 'Genel Soru',
    description: 'Diğer konular ve genel sorular',
    assignedTo: 'Yönetim',
    estimatedTime: '1-2 gün',
    estimatedCost: 'Ücretsiz',
    confidence: 70
  }
}

// Floating Action Button Component
interface FABProps {
  onClick: () => void
  className?: string
}

export function FloatingActionButton({ onClick, className }: FABProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "mobile-only:bottom-20", // Mobile'da bottom navigation'ın üstünde
        className
      )}
      size="lg"
    >
      <Plus className="w-6 h-6" />
    </Button>
  )
}

// Step 1: Kategori Seçimi
interface CategorySelectionProps {
  onSelect: (category: typeof ISSUE_CATEGORIES[0]) => void
  onClose: () => void
}

export function CategorySelection({ onSelect, onClose }: CategorySelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Sorun Kategorisi Seçin</h2>
        <p className="text-muted-foreground">Hangi konuda yardıma ihtiyacınız var?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ISSUE_CATEGORIES.map((category) => {
          const IconComponent = category.icon
          return (
            <Card
              key={category.id}
              className={cn(
                "card-interactive cursor-pointer transition-all duration-200 hover:scale-105",
                category.bgColor,
                category.borderColor
              )}
              onClick={() => onSelect(category)}
            >
              <CardContent className="p-6 text-center">
                <div className={cn("w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center", category.bgColor)}>
                  <IconComponent className={cn("w-8 h-8", category.color)} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{category.label}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onClose}>
          <X className="w-4 h-4 mr-2" />
          İptal
        </Button>
      </div>
    </div>
  )
}

// Step 2: Detay Formu
interface DetailFormProps {
  category: typeof ISSUE_CATEGORIES[0]
  onSubmit: (data: any) => void
  onBack: () => void
}

export function DetailForm({ category, onSubmit, onBack }: DetailFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    images: [] as File[]
  })
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      category: category.id,
      categoryLabel: category.label
    })
  }

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - formData.images.length)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleImageUpload(e.dataTransfer.files)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sorun Detayları</h2>
          <p className="text-muted-foreground">{category.label} kategorisi seçildi</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Adım 2/4</span>
          <span>%50</span>
        </div>
        <Progress value={50} className="h-2" />
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="form-group">
          <Label htmlFor="title">Başlık</Label>
          <Input
            id="title"
            placeholder={`${category.label} sorunu`}
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <Label htmlFor="description">Açıklama</Label>
          <Textarea
            id="description"
            placeholder="Sorununuzu detaylı olarak açıklayın..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            required
          />
        </div>

        {/* Aciliyet Seviyesi */}
        <div className="form-group">
          <Label>Aciliyet Seviyesi</Label>
          <RadioGroup
            value={formData.priority}
            onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            className="grid grid-cols-2 gap-4"
          >
            {PRIORITY_LEVELS.map((priority) => {
              const IconComponent = priority.icon
              return (
                <div key={priority.id} className="space-y-2">
                  <Label
                    htmlFor={priority.id}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      formData.priority === priority.id
                        ? `${priority.bgColor} ${priority.borderColor} border-opacity-100`
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <RadioGroupItem value={priority.id} id={priority.id} />
                    <div className="flex items-center space-x-2">
                      <IconComponent className={cn("w-4 h-4", priority.color)} />
                      <div>
                        <div className="font-medium">{priority.label}</div>
                        <div className="text-xs text-muted-foreground">{priority.description}</div>
                      </div>
                    </div>
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </div>

        {/* Fotoğraf Yükleme */}
        <div className="form-group">
          <Label>Fotoğraf Ekle (Opsiyonel)</Label>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-border",
              formData.images.length > 0 && "border-solid"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {formData.images.length === 0 ? (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Fotoğraf sürükleyin veya seçin</p>
                  <p className="text-sm text-muted-foreground">Maksimum 5 fotoğraf, her biri 10MB'dan küçük</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Fotoğraf Seç
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                {formData.images.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Daha Fazla Fotoğraf Ekle
                  </Button>
                )}
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri
        </Button>
        <Button type="submit" disabled={!formData.title || !formData.description}>
          <ArrowRight className="w-4 h-4 mr-2" />
          Devam Et
        </Button>
      </div>
    </form>
  )
}

// Step 3: AI Özeti
interface AISummaryProps {
  formData: any
  onConfirm: () => void
  onBack: () => void
}

export function AISummary({ formData, onConfirm, onBack }: AISummaryProps) {
  const suggestion = AI_SUGGESTIONS[formData.category as keyof typeof AI_SUGGESTIONS]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Analizi</h2>
          <p className="text-muted-foreground">Sorununuz analiz edildi</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Adım 3/4</span>
          <span>%75</span>
        </div>
        <Progress value={75} className="h-2" />
      </div>

      {/* AI Analysis Card */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            AI Önerisi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Confidence Score */}
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
            <span className="font-medium">Güven Skoru</span>
            <Badge variant="default">{suggestion.confidence}%</Badge>
          </div>

          {/* Assignment */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Atanacak Kişi</p>
                <p className="text-sm text-muted-foreground">{suggestion.assignedTo}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Tahmini Süre</p>
                <p className="text-sm text-muted-foreground">{suggestion.estimatedTime}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Tahmini Maliyet</p>
                <p className="text-sm text-muted-foreground">{suggestion.estimatedCost}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Özet</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              "{formData.title}" başlıklı sorununuz <strong>{suggestion.assignedTo}</strong> kişisine iletilecek. 
              Tahmini çözüm süresi <strong>{suggestion.estimatedTime}</strong> olarak belirlenmiştir.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Data Review */}
      <Card className="card-flat">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Sorun Detayları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Kategori</Label>
            <p className="text-sm text-muted-foreground">{formData.categoryLabel}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Başlık</Label>
            <p className="text-sm text-muted-foreground">{formData.title}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Açıklama</Label>
            <p className="text-sm text-muted-foreground">{formData.description}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Aciliyet</Label>
            <Badge variant="outline">
              {PRIORITY_LEVELS.find(p => p.id === formData.priority)?.label}
            </Badge>
          </div>
          {formData.images.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Fotoğraflar</Label>
              <p className="text-sm text-muted-foreground">{formData.images.length} fotoğraf eklendi</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Düzenle
        </Button>
        <Button onClick={onConfirm}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Onayla ve Gönder
        </Button>
      </div>
    </div>
  )
}

// Step 4: Onay & Takip
interface ConfirmationProps {
  formData: any
  onClose: () => void
}

export function Confirmation({ formData, onClose }: ConfirmationProps) {
  const { toast } = useToast()
  const suggestion = AI_SUGGESTIONS[formData.category as keyof typeof AI_SUGGESTIONS]

  const handleTrackRequest = () => {
    toast({
      title: "Takip sayfasına yönlendiriliyor",
      description: "Sorununuzun durumunu takip edebilirsiniz."
    })
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sorun Başarıyla Bildirildi!</h2>
          <p className="text-muted-foreground">Sorununuz sisteme kaydedildi ve ilgili kişiye iletildi</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Adım 4/4</span>
          <span>%100</span>
        </div>
        <Progress value={100} className="h-2" />
      </div>

      {/* Request Details */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Talep Detayları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Talep No</Label>
              <p className="text-sm text-muted-foreground">#MR-2024-001</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Tarih</Label>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('tr-TR')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Kategori</Label>
              <p className="text-sm text-muted-foreground">{formData.categoryLabel}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Aciliyet</Label>
              <Badge variant="outline">
                {PRIORITY_LEVELS.find(p => p.id === formData.priority)?.label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="card-flat">
        <CardHeader>
          <CardTitle>Sonraki Adımlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
            </div>
            <div>
              <p className="font-medium">İnceleme</p>
              <p className="text-sm text-muted-foreground">
                Sorununuz {suggestion.assignedTo} tarafından incelenecek
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">2</span>
            </div>
            <div>
              <p className="font-medium">Planlama</p>
              <p className="text-sm text-muted-foreground">
                Çözüm için tarih planlanacak (Tahmini: {suggestion.estimatedTime})
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-xs font-bold text-green-600 dark:text-green-400">3</span>
            </div>
            <div>
              <p className="font-medium">Çözüm</p>
              <p className="text-sm text-muted-foreground">
                Sorun çözülecek ve size bildirim gönderilecek
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleTrackRequest} className="flex-1">
          <Eye className="w-4 h-4 mr-2" />
          Talebi Takip Et
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Sorun Bildir
        </Button>
      </div>
    </div>
  )
}

// Main Issue Reporting Flow Component
export function IssueReportingFlow() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<typeof ISSUE_CATEGORIES[0] | null>(null)

  const handleCategorySelect = (category: typeof ISSUE_CATEGORIES[0]) => {
    setSelectedCategory(category)
    setCurrentStep(2)
  }

  const handleFormSubmit = (data: any) => {
    setFormData(data)
    setCurrentStep(3)
  }

  const handleConfirm = () => {
    setCurrentStep(4)
  }

  const handleClose = () => {
    setIsOpen(false)
    setCurrentStep(1)
    setFormData(null)
    setSelectedCategory(null)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <>
      <FloatingActionButton onClick={() => setIsOpen(true)} />
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Sorun Bildirme</DialogTitle>
            <DialogDescription className="sr-only">
              Sorun bildirme akışı
            </DialogDescription>
          </DialogHeader>

          <div className="p-6">
            {currentStep === 1 && (
              <CategorySelection
                onSelect={handleCategorySelect}
                onClose={handleClose}
              />
            )}

            {currentStep === 2 && selectedCategory && (
              <DetailForm
                category={selectedCategory}
                onSubmit={handleFormSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && formData && (
              <AISummary
                formData={formData}
                onConfirm={handleConfirm}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && formData && (
              <Confirmation
                formData={formData}
                onClose={handleClose}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

