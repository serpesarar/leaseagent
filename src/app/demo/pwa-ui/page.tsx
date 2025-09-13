'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/core-components'
import { Button } from '@/components/ui/core-components'
import { Badge } from '@/components/ui/core-components'

export default function PWAUIPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">PWA UI Demo</h1>
          <p className="text-muted-foreground text-lg">
            Progressive Web App bileşenlerinin gösterimi
          </p>
        </div>

        <div className="grid gap-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Geçici</Badge>
                PWA UI Bileşenleri
              </CardTitle>
              <CardDescription>
                PWAInstallPrompt duplicate export hatası nedeniyle geçici olarak devre dışı bırakıldı
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Bu sayfa, PWA bileşenlerinin gösterimi için tasarlanmıştır. 
                  Şu anda teknik bir sorun nedeniyle geçici olarak basitleştirilmiştir.
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ana Sayfaya Dön
                  </Button>
                  <Button variant="outline" size="sm">
                    UI Checklist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PWA Features */}
          <Card>
            <CardHeader>
              <CardTitle>PWA Özellikleri</CardTitle>
              <CardDescription>
                Progressive Web App'in temel özellikleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">✅ Mevcut PWA Özellikleri</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Web App Manifest</li>
                    <li>• Service Worker</li>
                    <li>• Offline desteği</li>
                    <li>• Install prompt</li>
                    <li>• Push notifications</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">🔧 Geliştirilecek Özellikler</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• PWA UI bileşenleri</li>
                    <li>• Install banner</li>
                    <li>• Offline indicator</li>
                    <li>• Update notifications</li>
                    <li>• Share API</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PWA Info */}
          <Card>
            <CardHeader>
              <CardTitle>PWA Hakkında</CardTitle>
              <CardDescription>
                Progressive Web App teknolojisi hakkında bilgiler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Progressive Web App (PWA), web uygulamalarını native uygulamalar gibi 
                  çalıştırmaya olanak sağlayan teknolojidir. Offline çalışma, push notifications 
                  ve ana ekrana ekleme gibi özellikler sunar.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 border border-border rounded-lg">
                    <div className="text-2xl mb-2">📱</div>
                    <h4 className="font-medium text-sm">Mobil Uyumlu</h4>
                    <p className="text-xs text-muted-foreground">Responsive tasarım</p>
                  </div>
                  
                  <div className="text-center p-3 border border-border rounded-lg">
                    <div className="text-2xl mb-2">⚡</div>
                    <h4 className="font-medium text-sm">Hızlı</h4>
                    <p className="text-xs text-muted-foreground">Service Worker</p>
                  </div>
                  
                  <div className="text-center p-3 border border-border rounded-lg">
                    <div className="text-2xl mb-2">🔔</div>
                    <h4 className="font-medium text-sm">Bildirimler</h4>
                    <p className="text-xs text-muted-foreground">Push API</p>
                  </div>
                  
                  <div className="text-center p-3 border border-border rounded-lg">
                    <div className="text-2xl mb-2">📲</div>
                    <h4 className="font-medium text-sm">Kurulum</h4>
                    <p className="text-xs text-muted-foreground">Install prompt</p>
                  </div>
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
                  <div className="text-2xl">✅</div>
                  <span className="text-sm">UI Checklist</span>
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