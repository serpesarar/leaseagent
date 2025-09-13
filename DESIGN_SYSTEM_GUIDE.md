# Property Management Platform - Design System Guide

## 🎨 Overview

Bu doküman Property Management Platform'un kapsamlı tasarım sistemini açıklar. Modern, erişilebilir ve kullanıcı dostu bir arayüz sağlamak için Shadcn/ui + Tailwind CSS kombinasyonu kullanılmıştır.

## 📋 İçindekiler

1. [Renk Paleti](#renk-paleti)
2. [Tipografi](#tipografi)
3. [Layout Sistemi](#layout-sistemi)
4. [Bileşenler](#bileşenler)
5. [Responsive Tasarım](#responsive-tasarım)
6. [Tema Sistemi](#tema-sistemi)
7. [Erişilebilirlik](#erişilebilirlik)
8. [Kullanım Örnekleri](#kullanım-örnekleri)

## 🎨 Renk Paleti

### Ana Renkler

```css
/* Ana Renkler */
--primary: #2563EB     /* Güven veren mavi - Ana eylemler için */
--secondary: #10B981   /* Onay/Başarı yeşili - Pozitif durumlar için */
--accent: #8B5CF6      /* Vurgu moru - Özel vurgular için */

/* Durum Renkleri */
--success: #22C55E     /* Başarı durumları */
--warning: #F59E0B     /* Uyarı durumları */
--danger: #EF4444      /* Hata/Tehlike durumları */
--info: #3B82F6        /* Bilgi mesajları */

/* Nötr Renkler - Light Mode */
--background: #F9FAFB  /* Ana arka plan */
--foreground: #111827  /* Ana metin rengi */
--muted: #F3F4F6       /* İkincil arka plan */
--border: #E5E7EB      /* Kenarlık rengi */

/* Gri Skalası */
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-400: #9CA3AF
--gray-500: #6B7280
--gray-600: #4B5563
--gray-700: #374151
--gray-800: #1F2937
--gray-900: #111827
```

### Renk Kullanım Rehberi

| Renk | Kullanım Alanı | Örnek |
|------|----------------|-------|
| Primary | Ana butonlar, linkler, odak durumları | "Giriş Yap" butonu |
| Secondary | İkincil eylemler, başarı durumları | "Kaydet" butonu |
| Accent | Özel vurgular, premium özellikler | Premium badge |
| Success | Başarılı işlemler, onay mesajları | "Ödeme tamamlandı" |
| Warning | Uyarılar, dikkat gerektiren durumlar | "Ödeme tarihi yaklaşıyor" |
| Danger | Hatalar, silme eylemleri | "Hesap sil" butonu |
| Info | Bilgilendirme mesajları | Yardım ipuçları |

## 📝 Tipografi

### Font Aileleri

```css
/* Ana font ailesi */
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace (kod blokları için) */
font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

### Tipografi Hiyerarşisi

| Sınıf | Boyut | Kullanım |
|-------|-------|----------|
| `.text-heading-1` | 36px / 2.25rem | Ana başlıklar |
| `.text-heading-2` | 30px / 1.875rem | Bölüm başlıkları |
| `.text-heading-3` | 24px / 1.5rem | Alt başlıklar |
| `.text-heading-4` | 20px / 1.25rem | Kart başlıkları |
| `.text-body-large` | 18px / 1.125rem | Büyük gövde metni |
| `.text-body` | 16px / 1rem | Normal gövde metni |
| `.text-body-small` | 14px / 0.875rem | Küçük açıklamalar |
| `.text-caption` | 12px / 0.75rem | Etiketler, zaman damgaları |

### Font Ağırlıkları

- `font-thin` (100) - Çok ince metinler
- `font-light` (300) - İnce metinler  
- `font-normal` (400) - Normal metinler
- `font-medium` (500) - Orta kalın metinler
- `font-semibold` (600) - Yarı kalın metinler
- `font-bold` (700) - Kalın başlıklar
- `font-extrabold` (800) - Çok kalın metinler

## 📐 Layout Sistemi

### Grid Sistemi

```css
/* Dashboard grid sistemleri */
.dashboard-grid     /* Otomatik boyutlandırma */
.dashboard-grid-2   /* 2 sütun (lg+) */
.dashboard-grid-3   /* 3 sütun (lg+) */
.dashboard-grid-4   /* 4 sütun (lg+) */
```

### Responsive Breakpoints

```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Küçük tabletler */
md: 768px   /* Tabletler */
lg: 1024px  /* Küçük masaüstü */
xl: 1280px  /* Masaüstü */
2xl: 1536px /* Büyük masaüstü */
```

### Layout Türleri

#### Desktop Layout (1024px+)
```
┌─────────────────────────────────────┐
│ Sidebar │      Header             │
├─────────┼─────────────────────────┤
│         │                         │
│ 240px   │      Main Content       │
│         │                         │
│ Navigation │   ┌──────┬──────┐    │
│ Menu    │   │ Card │ Card │    │
│         │   └──────┴──────┘    │
└─────────────────────────────────────┘
```

#### Mobile Layout (< 768px)
```
┌─────────────────┐
│   Top Header    │
├─────────────────┤
│                 │
│  Full Content   │
│                 │
├─────────────────┤
│ Bottom Nav Bar  │
└─────────────────┘
```

### Spacing Sistemi

```css
/* Tailwind spacing scale */
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
```

## 🧩 Bileşenler

### Temel Bileşenler

#### Button Variants
```tsx
<Button variant="default">Varsayılan</Button>
<Button variant="primary">Ana Buton</Button>
<Button variant="secondary">İkincil</Button>
<Button variant="outline">Çerçeveli</Button>
<Button variant="ghost">Gölge</Button>
<Button variant="destructive">Tehlikeli</Button>
```

#### Card Types
```tsx
<Card className="card-elevated">Yükseltilmiş Kart</Card>
<Card className="card-flat">Düz Kart</Card>
<Card className="card-interactive">Etkileşimli Kart</Card>
```

#### Status Cards
```tsx
<Card className="status-card-success">Başarı Kartı</Card>
<Card className="status-card-warning">Uyarı Kartı</Card>
<Card className="status-card-danger">Hata Kartı</Card>
<Card className="status-card-info">Bilgi Kartı</Card>
```

### Özel Bileşenler

#### MetricCard
```tsx
<MetricCard
  title="Aktif Mülkler"
  value="24"
  trend={{ value: 12, period: "bu ay", positive: true }}
  icon={<Building2 className="w-6 h-6 text-primary" />}
  variant="success"
/>
```

#### PropertyCard
```tsx
<PropertyCard
  property={{
    id: "1",
    name: "Merkez Apartmanı",
    address: "Kadıköy, İstanbul",
    units: 12,
    occupancy: 10,
    monthlyRevenue: 45000,
    status: "active"
  }}
  onView={(id) => console.log("View", id)}
  onEdit={(id) => console.log("Edit", id)}
/>
```

#### DataTable
```tsx
<DataTable
  data={properties}
  columns={[
    { key: 'name', label: 'Mülk Adı', sortable: true },
    { key: 'units', label: 'Daire Sayısı', sortable: true },
    { key: 'occupancy', label: 'Doluluk', render: (value, row) => 
        `${value}/${row.units}` 
    }
  ]}
  searchable
  exportable
  selectable
/>
```

## 📱 Responsive Tasarım

### Mobile-First Yaklaşım

1. **Temel tasarım mobile için optimize edilir**
2. **Progressively enhancement ile masaüstü özellikleri eklenir**
3. **Touch-friendly etkileşimler öncelikli**

### Responsive Utilities

```css
.mobile-only    /* Sadece mobile görünür */
.desktop-only   /* Sadece masaüstü görünür */
.tablet-up      /* Tablet ve üzeri görünür */
```

### Navigation Patterns

#### Mobile Navigation
- **Bottom Navigation Bar**: Ana navigasyon
- **Hamburger Menu**: Tüm menü öğelerine erişim
- **Swipe Gestures**: Hızlı eylemler için

#### Desktop Navigation
- **Sidebar**: Kalıcı yan navigasyon
- **Breadcrumbs**: Konum göstergesi
- **Top Header**: Kullanıcı eylemleri

### Touch Optimization

```css
.quick-action-btn {
  min-height: 44px; /* Apple'ın önerdiği minimum dokunma alanı */
  padding: 12px 16px;
  border-radius: 8px;
}

.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

## 🎭 Tema Sistemi

### Tema Türleri

1. **Light Mode**: Varsayılan açık tema
2. **Dark Mode**: Koyu tema
3. **System**: Sistem tercihini takip eder

### Renk Şemaları

```tsx
// Mevcut renk şemaları
const colorSchemes = {
  blue: { primary: '#2563EB', name: 'Mavi' },
  green: { primary: '#22C55E', name: 'Yeşil' },
  purple: { primary: '#9333EA', name: 'Mor' },
  orange: { primary: '#F97316', name: 'Turuncu' },
  red: { primary: '#EF4444', name: 'Kırmızı' }
}
```

### Tema Kullanımı

```tsx
// ThemeProvider ile sarmalama
<ThemeProvider defaultTheme="system" defaultColorScheme="blue">
  <App />
</ThemeProvider>

// Hook ile tema kontrolü
const { setTheme, setColorScheme, config } = useTheme()

// Tema değiştirici bileşen
<ThemeCustomizer />
<ThemeToggle />
```

### Özelleştirme Seçenekleri

- **Tema Modu**: Light, Dark, System
- **Renk Şeması**: 5 farklı renk paleti
- **Font Boyutu**: Küçük, Orta, Büyük
- **Köşe Yuvarlaklığı**: Yok, Küçük, Orta, Büyük
- **Animasyonlar**: Etkin/Devre dışı

## ♿ Erişilebilirlik

### WCAG 2.1 Uyumluluğu

#### Renk Kontrastı
- **AA Seviyesi**: Minimum 4.5:1 kontrast oranı
- **AAA Seviyesi**: 7:1 kontrast oranı (büyük metinler için)

#### Klavye Navigasyonu
- Tüm etkileşimli öğeler klavye ile erişilebilir
- Tab sırası mantıklı ve öngörülebilir
- Focus göstergeleri net ve görünür

#### Ekran Okuyucu Desteği
```tsx
// Semantic HTML kullanımı
<main role="main">
  <h1>Ana Başlık</h1>
  <nav aria-label="Ana navigasyon">
    <ul>
      <li><a href="/dashboard">Dashboard</a></li>
    </ul>
  </nav>
</main>

// ARIA etiketleri
<button aria-label="Menüyü aç" aria-expanded="false">
  <MenuIcon />
</button>

// Form etiketleri
<label htmlFor="email">E-posta Adresi</label>
<input id="email" type="email" required />
```

#### Responsive Text
- Zoom %200'e kadar kullanılabilir
- Metin taşmaları önlenir
- Yatay kaydırma gerektirmez

### Accessibility Components

```tsx
// Odak yakalama
<FocusTrap>
  <Modal>...</Modal>
</FocusTrap>

// Erişilebilir form alanları
<AccessibleField
  label="Mülk Adı"
  error="Bu alan zorunludur"
  helperText="Mülkün tam adını girin"
>
  <input type="text" />
</AccessibleField>

// Skip link
<SkipLink href="#main-content">
  Ana içeriğe geç
</SkipLink>
```

## 💡 Kullanım Örnekleri

### Rol Bazlı Dashboard Tasarımları

#### Kiracı (Tenant) Dashboard
```tsx
// Temiz, minimal, kolay erişim odaklı
<TenantDashboard>
  <WelcomeCard>
    {/* Önemli bilgiler */}
    - Kalan kira günü
    - Sonraki ödeme
    - Aktif sorun sayısı
  </WelcomeCard>

  <QuickActions>
    {/* Büyük, dokunmaya uygun butonlar */}
    - 🔧 Sorun Bildir (prominent)
    - 💳 Kira Öde
    - 📄 Sözleşmemi Gör
    - 📞 Acil Durum
  </QuickActions>

  <RecentActivity />
</TenantDashboard>
```

#### Mülk Yöneticisi Dashboard
```tsx
// Veri yoğun, analitik odaklı
<ManagerDashboard>
  <MetricsGrid>
    <MetricCard title="Toplam Mülk" value="15" />
    <MetricCard title="Doluluk Oranı" value="92%" />
    <MetricCard title="Aylık Gelir" value="₺245,000" />
  </MetricsGrid>

  <ChartsSection>
    <OccupancyChart />
    <RevenueChart />
  </ChartsSection>

  <TasksAndAlerts>
    <MaintenanceRequests />
    <PaymentAlerts />
  </TasksAndAlerts>
</ManagerDashboard>
```

### Form Tasarımı

```tsx
// Modern form tasarımı
<form className="space-y-6">
  <div className="form-group">
    <label className="form-label">Mülk Adı</label>
    <input className="form-input" type="text" />
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div className="form-group">
      <label className="form-label">Daire Sayısı</label>
      <input className="form-input" type="number" />
    </div>
    <div className="form-group">
      <label className="form-label">Aylık Kira</label>
      <input className="form-input" type="text" />
    </div>
  </div>

  <Button type="submit" className="w-full">
    Mülk Ekle
  </Button>
</form>
```

### Durum Göstergeleri

```tsx
// Badge kullanımı
<Badge variant="success">Aktif</Badge>
<Badge variant="warning">Beklemede</Badge>
<Badge variant="danger">Sorunlu</Badge>

// Status dot kullanımı
<div className="flex items-center space-x-2">
  <div className="status-dot status-dot-success" />
  <span>Çevrimiçi</span>
</div>

// Progress bar kullanımı
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Doluluk Oranı</span>
    <span>85%</span>
  </div>
  <div className="progress-bar">
    <div className="progress-fill" style={{ width: '85%' }} />
  </div>
</div>
```

## 🔧 Geliştirici Notları

### CSS Değişkenleri

Tasarım sistemi CSS değişkenlerini kullanır, bu sayede tema değişiklikleri dinamik olarak uygulanabilir:

```css
:root {
  --primary: 38 99 235;
  --radius: 0.5rem;
}

.dark {
  --primary: 59 130 246;
}
```

### Tailwind CSS Konfigürasyonu

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  }
}
```

### Performans Optimizasyonları

1. **CSS-in-JS yerine CSS değişkenleri kullanımı**
2. **Tailwind CSS'in purge özelliği ile kullanılmayan stillerin temizlenmesi**
3. **Lazy loading ile bileşenlerin ihtiyaç duyulduğunda yüklenmesi**
4. **Memoization ile gereksiz re-render'ların önlenmesi**

## 📚 Kaynaklar

- [Shadcn/ui Dokümantasyonu](https://ui.shadcn.com/)
- [Tailwind CSS Dokümantasyonu](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Color System](https://material.io/design/color/)

---

Bu tasarım sistemi, kullanıcı deneyimini en üst düzeye çıkarmak ve geliştirici verimliliğini artırmak için sürekli olarak güncellenmektedir. Herhangi bir soru veya öneri için geliştirici ekibi ile iletişime geçebilirsiniz.

