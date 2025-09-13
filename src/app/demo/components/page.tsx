'use client'

import React, { useState } from 'react'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Badge,
  StatusDot,
  Avatar,
  Input,
  Alert,
  AlertTitle,
  AlertDescription,
  Skeleton,
  Divider
} from '@/components/ui/core-components'
import {
  Dropdown,
  DropdownItem,
  SearchInput,
  Counter,
  Rating,
  ActionButton,
  QuickActions,
  PropertyCard,
  ContactCard,
  StatsCard
} from '@/components/ui/advanced-components'
import { 
  Heart, 
  Star, 
  Share2, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'

export default function ComponentLibraryShowcase() {
  const [counterValue, setCounterValue] = useState(5)
  const [ratingValue, setRatingValue] = useState(4)
  const [searchValue, setSearchValue] = useState('')

  // Mock data
  const mockProperty = {
    id: '1',
    name: 'Merkez Apartmanı',
    address: 'Kadıköy, İstanbul',
    image: undefined,
    price: 8500,
    status: 'available' as const,
    rating: 4.5,
    amenities: ['Asansör', 'Güvenlik', 'Otopark', 'Bahçe']
  }

  const mockContact = {
    id: '1',
    name: 'Ahmet Yılmaz',
    role: 'Mülk Yöneticisi',
    avatar: undefined,
    phone: '+90 532 123 45 67',
    email: 'ahmet@example.com',
    company: 'PropManage A.Ş.'
  }

  const quickActions = [
    { icon: <Heart className="w-4 h-4" />, label: 'Beğen', onClick: () => console.log('Beğen') },
    { icon: <Share2 className="w-4 h-4" />, label: 'Paylaş', onClick: () => console.log('Paylaş') },
    { icon: <Download className="w-4 h-4" />, label: 'İndir', onClick: () => console.log('İndir') }
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Component Library</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Modern, tutarlı ve yeniden kullanılabilir UI bileşenleri. 
            Tüm bileşenler TypeScript ile yazılmış ve accessibility standartlarına uygun.
          </p>
        </div>

        {/* Core Components */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Temel Bileşenler</h2>
            <p className="text-muted-foreground">Foundation bileşenleri - Button, Card, Badge, Input vb.</p>
          </div>

          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Button Varyasyonları</CardTitle>
              <CardDescription>Farklı variant ve size seçenekleri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variants */}
              <div>
                <h4 className="font-semibold mb-3">Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="info">Info</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="font-semibold mb-3">Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                  <Button size="icon"><User className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h4 className="font-semibold mb-3">States</h4>
                <div className="flex flex-wrap gap-3">
                  <Button>Normal</Button>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button leftIcon={<Heart className="w-4 h-4" />}>With Left Icon</Button>
                  <Button rightIcon={<Star className="w-4 h-4" />}>With Right Icon</Button>
                  <Button fullWidth>Full Width</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Card Varyasyonları</CardTitle>
              <CardDescription>Farklı card stilleri ve kullanım örnekleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Default Card</CardTitle>
                    <CardDescription>Standart card görünümü</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Bu bir default card örneğidir.</p>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Elevated Card</CardTitle>
                    <CardDescription>Gölgeli card görünümü</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Bu bir elevated card örneğidir.</p>
                  </CardContent>
                </Card>

                <Card variant="interactive">
                  <CardHeader>
                    <CardTitle>Interactive Card</CardTitle>
                    <CardDescription>Tıklanabilir card görünümü</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Bu bir interactive card örneğidir.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badge & Status Components</CardTitle>
              <CardDescription>Durum göstergeleri ve etiketler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Badge Variants */}
              <div>
                <h4 className="font-semibold mb-3">Badge Variants</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>

              {/* Status Badges */}
              <div>
                <h4 className="font-semibold mb-3">Status Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge status="active">Active</Badge>
                  <Badge status="pending">Pending</Badge>
                  <Badge status="resolved">Resolved</Badge>
                  <Badge status="cancelled">Cancelled</Badge>
                  <Badge status="inProgress">In Progress</Badge>
                </div>
              </div>

              {/* Status Dots */}
              <div>
                <h4 className="font-semibold mb-3">Status Dots</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <StatusDot color="green" />
                    <span className="text-sm">Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusDot color="yellow" />
                    <span className="text-sm">Away</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusDot color="red" />
                    <span className="text-sm">Offline</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusDot color="green" pulse />
                    <span className="text-sm">Live</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Input Components</CardTitle>
              <CardDescription>Form elemanları ve input varyasyonları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Input placeholder="Normal input" />
                  <Input placeholder="Error state" error />
                  <Input placeholder="Success state" success />
                  <Input placeholder="With left icon" leftIcon={<User className="w-4 h-4" />} />
                  <Input placeholder="With right icon" rightIcon={<Eye className="w-4 h-4" />} />
                </div>
                <div className="space-y-3">
                  <Input size="sm" placeholder="Small input" />
                  <Input size="md" placeholder="Medium input" />
                  <Input size="lg" placeholder="Large input" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avatars */}
          <Card>
            <CardHeader>
              <CardTitle>Avatar Component</CardTitle>
              <CardDescription>Kullanıcı profil resimleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar size="sm" fallback="AY" />
                <Avatar size="md" fallback="BY" />
                <Avatar size="lg" fallback="CY" />
                <Avatar size="xl" fallback="DY" />
                <Avatar size="2xl" fallback="EY" />
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Components</CardTitle>
              <CardDescription>Bilgilendirme ve uyarı mesajları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="default" icon={<Info className="w-4 h-4" />}>
                <AlertTitle>Bilgi</AlertTitle>
                <AlertDescription>Bu bir bilgi mesajıdır.</AlertDescription>
              </Alert>
              
              <Alert variant="success" icon={<CheckCircle className="w-4 h-4" />}>
                <AlertTitle>Başarılı</AlertTitle>
                <AlertDescription>İşlem başarıyla tamamlandı.</AlertDescription>
              </Alert>
              
              <Alert variant="warning" icon={<AlertTriangle className="w-4 h-4" />}>
                <AlertTitle>Uyarı</AlertTitle>
                <AlertDescription>Bu işlem geri alınamaz.</AlertDescription>
              </Alert>
              
              <Alert variant="destructive" icon={<AlertTriangle className="w-4 h-4" />}>
                <AlertTitle>Hata</AlertTitle>
                <AlertDescription>Bir hata oluştu.</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        <Divider />

        {/* Advanced Components */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Gelişmiş Bileşenler</CardTitle>
            <p className="text-muted-foreground">Karmaşık etkileşimler ve özel kullanım durumları</p>
          </div>

          {/* Dropdown */}
          <Card>
            <CardHeader>
              <CardTitle>Dropdown Component</CardTitle>
              <CardDescription>Açılır menü bileşeni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Dropdown
                  trigger={
                    <Button variant="outline">
                      Actions <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  }
                >
                  <DropdownItem onClick={() => console.log('Edit')}>
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </DropdownItem>
                  <DropdownItem onClick={() => console.log('Delete')}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sil
                  </DropdownItem>
                  <DropdownItem onClick={() => console.log('Share')}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Paylaş
                  </DropdownItem>
                </Dropdown>
              </div>
            </CardContent>
          </Card>

          {/* Search Input */}
          <Card>
            <CardHeader>
              <CardTitle>Search Input</CardTitle>
              <CardDescription>Gelişmiş arama bileşeni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md">
                <SearchInput
                  placeholder="Mülk ara..."
                  value={searchValue}
                  onChange={setSearchValue}
                  onSearch={(value) => console.log('Search:', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Counter */}
          <Card>
            <CardHeader>
              <CardTitle>Counter Component</CardTitle>
              <CardDescription>Sayı artırma/azaltma bileşeni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Counter
                  value={counterValue}
                  onChange={setCounterValue}
                  min={0}
                  max={10}
                />
                <span className="text-sm text-muted-foreground">Mevcut değer: {counterValue}</span>
              </div>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Component</CardTitle>
              <CardDescription>Yıldız puanlama bileşeni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Rating
                    value={ratingValue}
                    onChange={setRatingValue}
                    max={5}
                  />
                  <span className="text-sm text-muted-foreground">Puan: {ratingValue}/5</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Rating
                    value={4}
                    max={5}
                    readonly
                    size="lg"
                  />
                  <span className="text-sm text-muted-foreground">Sadece okuma</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Hızlı eylem butonları</CardDescription>
            </CardHeader>
            <CardContent>
              <QuickActions actions={quickActions} />
            </CardContent>
          </Card>

          {/* Property Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Card</CardTitle>
              <CardDescription>Mülk kartı bileşeni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm">
                <PropertyCard
                  property={mockProperty}
                  onView={(id) => console.log('View property:', id)}
                  onEdit={(id) => console.log('Edit property:', id)}
                  onDelete={(id) => console.log('Delete property:', id)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Card</CardTitle>
              <CardDescription>İletişim kartı bileşeni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm">
                <ContactCard
                  contact={mockContact}
                  onCall={(phone) => console.log('Call:', phone)}
                  onEmail={(email) => console.log('Email:', email)}
                  onView={(id) => console.log('View contact:', id)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Stats Cards</CardTitle>
              <CardDescription>İstatistik kartları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                  title="Toplam Mülk"
                  value="24"
                  change={{ value: 12, type: 'increase', period: 'bu ay' }}
                  icon={<Building2 className="w-6 h-6 text-blue-600" />}
                />
                <StatsCard
                  title="Aylık Gelir"
                  value="₺245,000"
                  change={{ value: 8.5, type: 'increase', period: 'bu ay' }}
                  icon={<DollarSign className="w-6 h-6 text-green-600" />}
                />
                <StatsCard
                  title="Kiracı Sayısı"
                  value="156"
                  change={{ value: 5.2, type: 'increase', period: 'bu ay' }}
                  icon={<Users className="w-6 h-6 text-purple-600" />}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <Divider />

        {/* Loading States */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Loading States</h2>
            <p className="text-muted-foreground">Yükleme durumları ve skeleton bileşenleri</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton Components</CardTitle>
              <CardDescription>İçerik yüklenirken gösterilen placeholder'lar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Usage Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Kullanım Örnekleri</h2>
            <p className="text-muted-foreground">Gerçek dünya senaryolarında bileşen kullanımları</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard Layout Example</CardTitle>
              <CardDescription>Bileşenlerin birlikte kullanımı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Mülk Yönetimi</h3>
                    <p className="text-sm text-muted-foreground">Aktif mülkleriniz</p>
                  </div>
                  <div className="flex space-x-2">
                    <SearchInput placeholder="Mülk ara..." />
                    <Button>Yeni Mülk</Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatsCard
                    title="Toplam Mülk"
                    value="12"
                    icon={<Building2 className="w-5 h-5 text-blue-600" />}
                  />
                  <StatsCard
                    title="Dolu Daireler"
                    value="45"
                    icon={<Users className="w-5 h-5 text-green-600" />}
                  />
                  <StatsCard
                    title="Aylık Gelir"
                    value="₺125,000"
                    icon={<DollarSign className="w-5 h-5 text-purple-600" />}
                  />
                  <StatsCard
                    title="Doluluk Oranı"
                    value="%87"
                    icon={<TrendingUp className="w-5 h-5 text-orange-600" />}
                  />
                </div>

                {/* Property List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <PropertyCard property={mockProperty} />
                  <PropertyCard property={{...mockProperty, id: '2', name: 'Park Residence', status: 'occupied'}} />
                  <PropertyCard property={{...mockProperty, id: '3', name: 'Güneş Sitesi', status: 'maintenance'}} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Code Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Kod Örnekleri</h2>
            <p className="text-muted-foreground">Bileşenlerin nasıl kullanılacağına dair örnekler</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Import Statements</CardTitle>
              <CardDescription>Bileşenleri projenize nasıl dahil edeceğiniz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre>{`// Temel bileşenler
import { 
  Button, 
  Card, 
  Badge, 
  StatusDot,
  Avatar,
  Input,
  Alert 
} from '@/components/ui/core-components'

// Gelişmiş bileşenler
import {
  Dropdown,
  SearchInput,
  Counter,
  Rating,
  PropertyCard,
  StatsCard
} from '@/components/ui/advanced-components'`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Button Usage</CardTitle>
              <CardDescription>Button bileşeninin farklı kullanımları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre>{`// Temel kullanım
<Button>Click me</Button>

// Varyasyonlar
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>

// Boyutlar
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// Durumlar
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// İkonlar
<Button leftIcon={<Heart />}>With Icon</Button>
<Button rightIcon={<Star />}>With Icon</Button>`}</pre>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

