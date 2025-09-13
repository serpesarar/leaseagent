# UI Checklist - Kapsamlı UI Bileşenleri

Modern web uygulamaları için kapsamlı UI bileşenleri koleksiyonu. Bu dokümantasyon, PropManage platformunda kullanılan tüm UI bileşenlerini ve özelliklerini detaylandırır.

## 📋 Checklist Özeti

### ✅ Tamamlanan Bileşenler

- [x] **Dark/Light mode toggle** - Tema değiştirici bileşenler
- [x] **Mobile bottom navigation** - Mobil alt navigasyon menüsü
- [x] **Floating Action Button (FAB)** - Hızlı eylemler için yüzen buton
- [x] **Skeleton loaders** - Yükleme durumları için skeleton bileşenleri
- [x] **Pull-to-refresh (mobile)** - Mobil çekerek yenileme
- [x] **Swipe gestures** - Kaydırma hareketleri
- [x] **Voice input support** - Sesli giriş desteği
- [x] **Biometric authentication UI** - Biyometrik kimlik doğrulama
- [x] **Progressive image loading** - Aşamalı resim yükleme
- [x] **Infinite scroll for lists** - Sonsuz kaydırma
- [x] **Search with filters** - Gelişmiş arama ve filtreleme
- [x] **Bulk actions** - Toplu işlemler
- [x] **Drag & drop file upload** - Sürükle bırak dosya yükleme
- [x] **Real-time status updates** - Gerçek zamanlı durum güncellemeleri
- [x] **Notification center** - Bildirim merkezi
- [x] **Help tooltips** - Yardım tooltip'leri
- [x] **Onboarding tour** - Kullanıcı tanıtım turu
- [x] **Breadcrumb navigation** - Sayfa hiyerarşisi navigasyonu
- [x] **Quick switcher (CMD+K)** - Hızlı geçiş menüsü
- [x] **Keyboard shortcuts overlay** - Klavye kısayolları

## 🎨 Bileşen Detayları

### 1. Dark/Light Mode Toggle

**Dosya:** `src/components/ui/checklist-components.tsx`

```tsx
// Button Style
<ThemeToggle variant="button" />

// Switch Style  
<ThemeToggle variant="switch" />

// Icon Style
<ThemeToggle variant="icon" />
```

**Özellikler:**
- 3 farklı varyasyon (button, switch, icon)
- LocalStorage ile tema tercihi saklama
- Otomatik sistem teması algılama
- Smooth geçiş animasyonları

### 2. Mobile Bottom Navigation

**Dosya:** `src/components/ui/checklist-components.tsx`

```tsx
<MobileBottomNav
  items={[
    {
      id: 'home',
      label: 'Ana Sayfa',
      icon: <Home className="w-5 h-5" />,
      active: true
    },
    {
      id: 'notifications',
      label: 'Bildirimler',
      icon: <Bell className="w-5 h-5" />,
      badge: 5
    }
  ]}
/>
```

**Özellikler:**
- Sadece mobil cihazlarda görünür
- Badge desteği
- Active state gösterimi
- Touch-friendly tasarım

### 3. Floating Action Button (FAB)

**Dosya:** `src/components/ui/checklist-components.tsx`

```tsx
<FAB
  icon={<Plus className="w-6 h-6" />}
  label="Yeni Ekle"
  onClick={() => console.log('Add clicked')}
  variant="primary"
  size="md"
  position="bottom-right"
/>
```

**Özellikler:**
- 3 varyasyon (primary, secondary, accent)
- 3 boyut (sm, md, lg)
- 4 pozisyon seçeneği
- Hover ve active animasyonları

### 4. Skeleton Loaders

**Dosya:** `src/components/ui/checklist-components.tsx`

```tsx
// Text skeleton
<Skeleton variant="text" />

// Rectangular skeleton
<Skeleton variant="rectangular" height={100} />

// Circular skeleton
<Skeleton variant="circular" width={60} height={60} />

// Rounded skeleton
<Skeleton variant="rounded" height={80} />
```

**Özellikler:**
- 4 varyasyon (text, rectangular, circular, rounded)
- 3 animasyon türü (pulse, wave, none)
- Özelleştirilebilir boyutlar
- Responsive tasarım

### 5. Pull-to-Refresh

**Dosya:** `src/components/ui/checklist-components.tsx`

```tsx
<PullToRefresh onRefresh={handleRefresh}>
  <div className="content">
    {/* Your content here */}
  </div>
</PullToRefresh>
```

**Özellikler:**
- Mobil cihazlarda çekerek yenileme
- Özelleştirilebilir threshold ve resistance
- Visual feedback
- Smooth animasyonlar

### 6. Swipe Gestures

**Dosya:** `src/components/ui/checklist-components.tsx`

```tsx
<SwipeGesture
  onSwipeLeft={() => console.log('Swipe left')}
  onSwipeRight={() => console.log('Swipe right')}
  onSwipeUp={() => console.log('Swipe up')}
  onSwipeDown={() => console.log('Swipe down')}
  threshold={50}
>
  <div>Your swipeable content</div>
</SwipeGesture>
```

**Özellikler:**
- 4 yön desteği (left, right, up, down)
- Özelleştirilebilir threshold
- Touch event handling
- Cross-platform uyumluluk

### 7. Voice Input Support

**Dosya:** `src/components/ui/checklist-components.tsx`

```tsx
<VoiceInput
  onTranscript={(text) => console.log(text)}
  onError={(error) => console.error(error)}
  language="tr-TR"
  continuous={false}
/>
```

**Özellikler:**
- Web Speech API desteği
- Çoklu dil desteği
- Continuous ve single mode
- Error handling

### 8. Biometric Authentication UI

**Dosya:** `src/components/ui/checklist-components-2.tsx`

```tsx
<BiometricAuth
  type="fingerprint"
  onSuccess={() => console.log('Success')}
  onError={(error) => console.error(error)}
/>
```

**Özellikler:**
- 3 tür (fingerprint, face, voice)
- WebAuthn API desteği
- Loading states
- Error handling

### 9. Progressive Image Loading

**Dosya:** `src/components/ui/checklist-components-2.tsx`

```tsx
<ProgressiveImage
  src="image.jpg"
  alt="Description"
  width={300}
  height={200}
  placeholder="Loading..."
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**Özellikler:**
- Placeholder desteği
- Blur placeholder
- Error state handling
- Lazy loading
- Priority loading

### 10. Infinite Scroll

**Dosya:** `src/components/ui/checklist-components-2.tsx`

```tsx
<InfiniteScroll
  hasMore={true}
  loadMore={handleLoadMore}
  threshold={100}
  loader={<CustomLoader />}
>
  {items.map(item => <Item key={item.id} {...item} />)}
</InfiniteScroll>
```

**Özellikler:**
- Intersection Observer API
- Özelleştirilebilir threshold
- Custom loader desteği
- Performance optimized

### 11. Search with Filters

**Dosya:** `src/components/ui/checklist-components-2.tsx`

```tsx
<SearchWithFilters
  onSearch={(query, filters) => console.log(query, filters)}
  filters={[
    {
      key: 'category',
      label: 'Kategori',
      type: 'select',
      options: [
        { value: 'all', label: 'Tümü' },
        { value: 'plumbing', label: 'Tesisat' }
      ]
    }
  ]}
  placeholder="Ara..."
/>
```

**Özellikler:**
- 4 filtre türü (select, multiselect, date, range)
- Real-time search
- Filter state management
- Responsive design

### 12. Bulk Actions

**Dosya:** `src/components/ui/checklist-components-2.tsx`

```tsx
<BulkActions
  selectedItems={['item1', 'item2']}
  onAction={(action, items) => console.log(action, items)}
  actions={[
    {
      id: 'assign',
      label: 'Ata',
      icon: <User className="w-4 h-4" />
    },
    {
      id: 'delete',
      label: 'Sil',
      icon: <Trash2 className="w-4 h-4" />,
      variant: 'destructive'
    }
  ]}
/>
```

**Özellikler:**
- Floating action bar
- Multiple action types
- Destructive action support
- Selection counter

### 13. Drag & Drop File Upload

**Dosya:** `src/components/ui/checklist-components-3.tsx`

```tsx
<DragDropUpload
  onUpload={(files) => console.log(files)}
  accept="image/*,video/*,.pdf"
  maxFiles={5}
  maxSize={10 * 1024 * 1024}
>
  <div>Custom drop zone content</div>
</DragDropUpload>
```

**Özellikler:**
- Drag & drop desteği
- File type validation
- Size validation
- Progress indicator
- Custom content support

### 14. Real-time Status Updates

**Dosya:** `src/components/ui/checklist-components-3.tsx`

```tsx
<RealtimeStatus
  status="online"
  lastUpdate={new Date()}
/>
```

**Özellikler:**
- 4 durum (online, offline, connecting, error)
- Auto-hide timer
- Last update timestamp
- Smooth animations

### 15. Notification Center

**Dosya:** `src/components/ui/checklist-components-3.tsx`

```tsx
<NotificationCenter
  notifications={notifications}
  onMarkAsRead={(id) => console.log('Mark as read', id)}
  onMarkAllAsRead={() => console.log('Mark all as read')}
/>
```

**Özellikler:**
- 4 notification türü (info, success, warning, error)
- Unread counter
- Action buttons
- Auto-dismiss
- Scrollable list

### 16. Help Tooltips

**Dosya:** `src/components/ui/checklist-components-3.tsx`

```tsx
<HelpTooltip
  content="Bu bir yardım tooltip'idir"
  position="top"
  delay={500}
>
  <Button>Hover me</Button>
</HelpTooltip>
```

**Özellikler:**
- 4 pozisyon (top, bottom, left, right)
- Custom delay
- Rich content support
- Arrow indicators

### 17. Onboarding Tour

**Dosya:** `src/components/ui/checklist-components-4.tsx`

```tsx
<OnboardingTour
  steps={[
    {
      id: '1',
      target: '.demo-card',
      title: 'Hoş Geldiniz!',
      content: 'Bu bir demo kartıdır',
      position: 'bottom'
    }
  ]}
  onComplete={() => console.log('Tour completed')}
  onSkip={() => console.log('Tour skipped')}
/>
```

**Özellikler:**
- Step-by-step guidance
- Element highlighting
- Custom positioning
- Navigation controls
- Progress indicator

### 18. Breadcrumb Navigation

**Dosya:** `src/components/ui/checklist-components-4.tsx`

```tsx
<Breadcrumb
  items={[
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Mülkler', href: '/properties' },
    { label: 'Mülk Detayı' }
  ]}
  separator={<ChevronRight className="w-4 h-4" />}
/>
```

**Özellikler:**
- Clickable links
- Custom separators
- Active state styling
- Responsive design

### 19. Quick Switcher (CMD+K)

**Dosya:** `src/components/ui/checklist-components-4.tsx`

```tsx
<QuickSwitcher
  onSelect={(item) => console.log('Selected', item)}
  items={[
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Ana kontrol paneli',
      icon: <Home className="w-4 h-4" />,
      category: 'Genel'
    }
  ]}
  placeholder="Ara..."
/>
```

**Özellikler:**
- Keyboard shortcut (⌘K)
- Category grouping
- Search functionality
- Keyboard navigation
- Rich item display

### 20. Keyboard Shortcuts Overlay

**Dosya:** `src/components/ui/checklist-components-4.tsx`

```tsx
<KeyboardShortcuts
  shortcuts={[
    { key: '⌘K', description: 'Hızlı geçiş', category: 'Genel' },
    { key: '⌘N', description: 'Yeni öğe', category: 'Genel' }
  ]}
/>
```

**Özellikler:**
- Keyboard shortcut (?)
- Category grouping
- Rich key display
- Search functionality
- Responsive layout

## 🚀 Kullanım Örnekleri

### Temel Kullanım

```tsx
import { 
  ThemeToggle,
  MobileBottomNav,
  FAB,
  Skeleton,
  PullToRefresh
} from '@/components/ui/checklist-components'

function MyComponent() {
  return (
    <div>
      <ThemeToggle variant="button" />
      <FAB icon={<Plus />} onClick={handleAdd} />
      <Skeleton variant="text" />
    </div>
  )
}
```

### Gelişmiş Kullanım

```tsx
import { 
  SearchWithFilters,
  BulkActions,
  DragDropUpload,
  NotificationCenter
} from '@/components/ui/checklist-components-2'

function AdvancedComponent() {
  const [selectedItems, setSelectedItems] = useState([])
  const [notifications, setNotifications] = useState([])

  return (
    <div>
      <SearchWithFilters
        onSearch={handleSearch}
        filters={searchFilters}
      />
      
      <BulkActions
        selectedItems={selectedItems}
        onAction={handleBulkAction}
        actions={bulkActions}
      />
      
      <DragDropUpload
        onUpload={handleUpload}
        accept="image/*"
        maxFiles={5}
      />
      
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  )
}
```

## 🎯 Özellikler

### Accessibility
- WCAG 2.1 AA uyumluluğu
- Keyboard navigation
- Screen reader desteği
- Focus indicators
- Color contrast ratios

### Performance
- Lazy loading
- Virtual scrolling
- Debounced search
- Optimized animations
- Memory management

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Adaptive components

### Internationalization
- Multi-language support
- RTL layout support
- Locale-specific formatting
- Cultural adaptations

## 🔧 Geliştirme

### Kurulum

```bash
npm install
```

### Geliştirme Sunucusu

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Test

```bash
npm run test
```

## 📱 Demo

Demo sayfası: `/demo/ui-checklist`

Bu sayfa tüm UI bileşenlerini interaktif olarak gösterir ve kullanım örnekleri sağlar.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- [Lucide React](https://lucide.dev/) - İkonlar için
- [Tailwind CSS](https://tailwindcss.com/) - Styling için
- [Radix UI](https://www.radix-ui.com/) - Accessibility için
- [React](https://reactjs.org/) - UI framework için
- [Next.js](https://nextjs.org/) - Framework için

