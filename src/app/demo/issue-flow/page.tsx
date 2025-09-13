'use client'

import React from 'react'
import { IssueReportingFlow } from '@/components/flows/issue-reporting-flow'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Smartphone, 
  MousePointer, 
  Zap, 
  CheckCircle, 
  Clock,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export default function IssueFlowDemo() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Sorun Bildirme Akışı</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Modern, kullanıcı dostu sorun bildirme deneyimi. 4 adımda kolayca sorununuzu bildirin.
          </p>
        </div>

        {/* Flow Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-elevated">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Kategori Seçimi</h3>
              <p className="text-sm text-muted-foreground">
                Büyük ikonlarla kolay kategori seçimi
              </p>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Detay Formu</h3>
              <p className="text-sm text-muted-foreground">
                Başlık, açıklama, fotoğraf ve aciliyet
              </p>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI Özeti</h3>
              <p className="text-sm text-muted-foreground">
                Otomatik analiz ve atama önerisi
              </p>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">4</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Onay & Takip</h3>
              <p className="text-sm text-muted-foreground">
                Onaylama ve takip bilgileri
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Mobile-First */}
          <Card className="card-flat">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
                Mobile-First Tasarım
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Touch-optimized büyük butonlar ve kolay navigasyon
              </p>
              <div className="space-y-2">
                <Badge variant="outline">44px+ Touch Target</Badge>
                <Badge variant="outline">Swipe Gestures</Badge>
                <Badge variant="outline">Responsive Layout</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Drag & Drop */}
          <Card className="card-flat">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MousePointer className="w-5 h-5 mr-2 text-green-600" />
                Drag & Drop Fotoğraf
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Fotoğrafları sürükleyip bırakarak kolayca ekleyin
              </p>
              <div className="space-y-2">
                <Badge variant="outline">Maksimum 5 Fotoğraf</Badge>
                <Badge variant="outline">10MB Limit</Badge>
                <Badge variant="outline">Preview</Badge>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card className="card-flat">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                AI Analizi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Otomatik kategori analizi ve uzman ataması
              </p>
              <div className="space-y-2">
                <Badge variant="outline">%85 Güven Skoru</Badge>
                <Badge variant="outline">Otomatik Atama</Badge>
                <Badge variant="outline">Tahmini Süre</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Updates */}
          <Card className="card-flat">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Real-time Takip
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Sorununuzun durumunu anlık takip edin
              </p>
              <div className="space-y-2">
                <Badge variant="outline">Push Notifications</Badge>
                <Badge variant="outline">Status Updates</Badge>
                <Badge variant="outline">Progress Tracking</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Priority Levels */}
          <Card className="card-flat">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Aciliyet Seviyeleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                4 farklı aciliyet seviyesi ile doğru önceliklendirme
              </p>
              <div className="space-y-2">
                <Badge variant="outline" className="text-green-600">Düşük</Badge>
                <Badge variant="outline" className="text-yellow-600">Orta</Badge>
                <Badge variant="outline" className="text-orange-600">Yüksek</Badge>
                <Badge variant="outline" className="text-red-600">Acil</Badge>
              </div>
            </CardContent>
          </Card>

          {/* User Experience */}
          <Card className="card-flat">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Kullanıcı Deneyimi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Sezgisel ve hızlı sorun bildirme süreci
              </p>
              <div className="space-y-2">
                <Badge variant="outline">Progress Bar</Badge>
                <Badge variant="outline">Auto-save</Badge>
                <Badge variant="outline">Validation</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Desteklenen Kategoriler</CardTitle>
            <CardDescription>Sorununuzu doğru kategoriye yerleştirin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🚰</span>
                </div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Su Tesisatı</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Musluk, lavabo, tuvalet, su sızıntısı
                </p>
              </div>

              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Elektrik</h3>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  Elektrik kesintisi, priz, anahtar, aydınlatma
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">Tamir</h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Kapı, pencere, mobilya, genel tamir
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200">Ödeme</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Kira ödemesi, faturalar, ödeme sorunları
                </p>
              </div>

              <div className="text-center p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">❓</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Diğer</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Diğer konular ve genel sorular
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Button */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 p-6 bg-muted/50 rounded-lg">
            <div className="text-left">
              <h3 className="font-semibold text-foreground">Demo'yu Deneyin</h3>
              <p className="text-sm text-muted-foreground">
                Sağ alt köşedeki + butonuna tıklayarak akışı test edin
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Technical Details */}
        <Card className="card-flat">
          <CardHeader>
            <CardTitle>Teknik Özellikler</CardTitle>
            <CardDescription>Modern teknolojilerle geliştirilmiş</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Frontend</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">React 18</span>
                    <Badge variant="outline">Modern Hooks</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">TypeScript</span>
                    <Badge variant="outline">Type Safety</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tailwind CSS</span>
                    <Badge variant="outline">Utility First</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Radix UI</span>
                    <Badge variant="outline">Accessible</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">UX Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress Tracking</span>
                    <Badge variant="outline">4 Steps</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Form Validation</span>
                    <Badge variant="outline">Real-time</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">File Upload</span>
                    <Badge variant="outline">Drag & Drop</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">AI Integration</span>
                    <Badge variant="outline">Smart Routing</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sorun Bildirme Akışı */}
      <IssueReportingFlow />
    </div>
  )
}

