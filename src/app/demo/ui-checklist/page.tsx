'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/core-components'
import { Button } from '@/components/ui/core-components'
import { Badge } from '@/components/ui/core-components'

export default function UIChecklistPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">UI Checklist Demo</h1>
          <p className="text-muted-foreground text-lg">
            Modern UI bileşenlerinin interaktif gösterimi
          </p>
        </div>

        <div className="grid gap-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Geçici</Badge>
                UI Checklist Bileşenleri
              </CardTitle>
              <CardDescription>
                BiometricAuth duplicate export hatası nedeniyle geçici olarak devre dışı bırakıldı
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Bu sayfa, UI Checklist bileşenlerinin gösterimi için tasarlanmıştır. 
                  Şu anda teknik bir sorun nedeniyle geçici olarak basitleştirilmiştir.
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ana Sayfaya Dön
                  </Button>
                  <Button variant="outline" size="sm">
                    PWA Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Features */}
          <Card>
            <CardHeader>
              <CardTitle>Mevcut Özellikler</CardTitle>
              <CardDescription>
                Şu anda çalışan özellikler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">✅ Çalışan Özellikler</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ana sayfa ve navigasyon</li>
                    <li>• PWA desteği</li>
                    <li>• Tema sistemi</li>
                    <li>• Responsive tasarım</li>
                    <li>• Temel UI bileşenleri</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">🔧 Geliştirilecek Özellikler</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• UI Checklist bileşenleri</li>
                    <li>• BiometricAuth komponenti</li>
                    <li>• Gelişmiş interaktif özellikler</li>
                    <li>• Demo sayfaları</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı Erişim</CardTitle>
              <CardDescription>
                Diğer demo sayfalarına hızlı erişim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <div className="text-2xl">🏠</div>
                  <span className="text-sm">Ana Sayfa</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <div className="text-2xl">📱</div>
                  <span className="text-sm">PWA Demo</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <div className="text-2xl">🎨</div>
                  <span className="text-sm">Tema Demo</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <div className="text-2xl">⚙️</div>
                  <span className="text-sm">Ayarlar</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}