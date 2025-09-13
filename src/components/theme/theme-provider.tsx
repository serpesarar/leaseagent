'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// Theme types
export type Theme = 'light' | 'dark' | 'system'
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red'

// Theme configuration
interface ThemeConfig {
  theme: Theme
  colorScheme: ColorScheme
  fontSize: 'small' | 'medium' | 'large'
  borderRadius: 'none' | 'small' | 'medium' | 'large'
  animations: boolean
}

// Default theme configuration
const defaultTheme: ThemeConfig = {
  theme: 'system',
  colorScheme: 'blue',
  fontSize: 'medium',
  borderRadius: 'medium',
  animations: true
}

// Color scheme definitions
const colorSchemes = {
  blue: {
    primary: '38 99 235', // #2563EB - Güven veren mavi
    secondary: '16 185 129', // #10B981 - Onay/Başarı yeşili  
    accent: '139 92 246', // #8B5CF6 - Vurgu moru
    name: 'Mavi'
  },
  green: {
    primary: '34 197 94', // #22C55E - Yeşil
    secondary: '59 130 246', // #3B82F6 - Mavi
    accent: '168 85 247', // #A855F7 - Mor
    name: 'Yeşil'
  },
  purple: {
    primary: '147 51 234', // #9333EA - Mor
    secondary: '34 197 94', // #22C55E - Yeşil
    accent: '249 115 22', // #F97316 - Turuncu
    name: 'Mor'
  },
  orange: {
    primary: '249 115 22', // #F97316 - Turuncu
    secondary: '59 130 246', // #3B82F6 - Mavi
    accent: '168 85 247', // #A855F7 - Mor
    name: 'Turuncu'
  },
  red: {
    primary: '239 68 68', // #EF4444 - Kırmızı
    secondary: '34 197 94', // #22C55E - Yeşil
    accent: '59 130 246', // #3B82F6 - Mavi
    name: 'Kırmızı'
  }
}

// Font size configurations
const fontSizes = {
  small: {
    base: '14px',
    scale: '0.875',
    name: 'Küçük'
  },
  medium: {
    base: '16px',
    scale: '1',
    name: 'Orta'
  },
  large: {
    base: '18px',
    scale: '1.125',
    name: 'Büyük'
  }
}

// Border radius configurations
const borderRadiusConfig = {
  none: {
    value: '0',
    name: 'Yok'
  },
  small: {
    value: '0.25rem',
    name: 'Küçük'
  },
  medium: {
    value: '0.5rem',
    name: 'Orta'
  },
  large: {
    value: '1rem',
    name: 'Büyük'
  }
}

// Theme context
interface ThemeContextType {
  config: ThemeConfig
  setTheme: (theme: Theme) => void
  setColorScheme: (scheme: ColorScheme) => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
  setBorderRadius: (radius: 'none' | 'small' | 'medium' | 'large') => void
  setAnimations: (enabled: boolean) => void
  resetTheme: () => void
  getColorScheme: () => typeof colorSchemes[ColorScheme]
  getFontSize: () => typeof fontSizes['small' | 'medium' | 'large']
  getBorderRadius: () => typeof borderRadiusConfig['none' | 'small' | 'medium' | 'large']
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme provider component
interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorScheme?: ColorScheme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultColorScheme = 'blue',
  storageKey = 'propmanage-theme',
  ...props
}: ThemeProviderProps) {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    // Load theme from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          return { ...defaultTheme, ...JSON.parse(stored) }
        }
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error)
      }
    }
    return {
      ...defaultTheme,
      theme: defaultTheme,
      colorScheme: defaultColorScheme
    }
  })

  // Save theme to localStorage
  const saveConfig = (newConfig: ThemeConfig) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newConfig))
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error)
      }
    }
  }

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark')
    
    // Apply theme
    if (config.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(config.theme)
    }

    // Apply color scheme
    const colors = colorSchemes[config.colorScheme] || colorSchemes.blue
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--secondary', colors.secondary)
    root.style.setProperty('--accent', colors.accent)

    // Apply font size
    const fontSize = fontSizes[config.fontSize] || fontSizes.medium
    root.style.setProperty('--font-size-base', fontSize.base)
    root.style.setProperty('--font-scale', fontSize.scale)

    // Apply border radius
    const borderRadius = borderRadiusConfig[config.borderRadius] || borderRadiusConfig.medium
    root.style.setProperty('--radius', borderRadius.value)

    // Apply animations
    if (!config.animations) {
      root.classList.add('no-animations')
    } else {
      root.classList.remove('no-animations')
    }

    // Save to localStorage
    saveConfig(config)
  }, [config, storageKey])

  // Listen for system theme changes
  useEffect(() => {
    if (config.theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(mediaQuery.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [config.theme])

  // Theme actions
  const setTheme = (theme: Theme) => {
    setConfig(prev => ({ ...prev, theme }))
  }

  const setColorScheme = (colorScheme: ColorScheme) => {
    setConfig(prev => ({ ...prev, colorScheme }))
  }

  const setFontSize = (fontSize: 'small' | 'medium' | 'large') => {
    setConfig(prev => ({ ...prev, fontSize }))
  }

  const setBorderRadius = (borderRadius: 'none' | 'small' | 'medium' | 'large') => {
    setConfig(prev => ({ ...prev, borderRadius }))
  }

  const setAnimations = (animations: boolean) => {
    setConfig(prev => ({ ...prev, animations }))
  }

  const resetTheme = () => {
    setConfig(defaultTheme)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey)
    }
  }

  const getColorScheme = () => colorSchemes[config.colorScheme]
  const getFontSize = () => fontSizes[config.fontSize]
  const getBorderRadius = () => borderRadiusConfig[config.borderRadius]

  const value: ThemeContextType = {
    config,
    setTheme,
    setColorScheme,
    setFontSize,
    setBorderRadius,
    setAnimations,
    resetTheme,
    getColorScheme,
    getFontSize,
    getBorderRadius
  }

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

// Theme customizer component
export function ThemeCustomizer() {
  const {
    config,
    setTheme,
    setColorScheme,
    setFontSize,
    setBorderRadius,
    setAnimations,
    resetTheme
  } = useTheme()

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Tema Ayarları</h3>
        <button
          onClick={resetTheme}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sıfırla
        </button>
      </div>

      {/* Theme Mode */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Tema Modu</label>
        <div className="grid grid-cols-3 gap-2">
          {(['light', 'dark', 'system'] as Theme[]).map((theme) => (
            <button
              key={theme}
              onClick={() => setTheme(theme)}
              className={cn(
                'p-3 rounded-lg border-2 transition-all text-sm font-medium',
                config.theme === theme
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-muted-foreground text-muted-foreground'
              )}
            >
              {theme === 'light' ? 'Açık' : theme === 'dark' ? 'Koyu' : 'Sistem'}
            </button>
          ))}
        </div>
      </div>

      {/* Color Scheme */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Renk Şeması</label>
        <div className="grid grid-cols-5 gap-2">
          {(Object.entries(colorSchemes) as [ColorScheme, typeof colorSchemes[ColorScheme]][]).map(([key, scheme]) => (
            <button
              key={key}
              onClick={() => setColorScheme(key)}
              className={cn(
                'p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-1',
                config.colorScheme === key
                  ? 'border-primary'
                  : 'border-border hover:border-muted-foreground'
              )}
            >
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: `rgb(${scheme.primary})` }}
              />
              <span className="text-xs text-muted-foreground">{scheme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Yazı Boyutu</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(fontSizes) as ['small' | 'medium' | 'large', typeof fontSizes['small']][]).map(([key, size]) => (
            <button
              key={key}
              onClick={() => setFontSize(key)}
              className={cn(
                'p-3 rounded-lg border-2 transition-all text-sm font-medium',
                config.fontSize === key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-muted-foreground text-muted-foreground'
              )}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Köşe Yuvarlaklığı</label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(borderRadiusConfig) as ['none' | 'small' | 'medium' | 'large', typeof borderRadiusConfig['none']][]).map(([key, radius]) => (
            <button
              key={key}
              onClick={() => setBorderRadius(key)}
              className={cn(
                'p-3 border-2 transition-all text-sm font-medium',
                config.borderRadius === key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-muted-foreground text-muted-foreground'
              )}
              style={{ borderRadius: key === 'none' ? '0' : key === 'small' ? '0.25rem' : key === 'medium' ? '0.5rem' : '1rem' }}
            >
              {radius.name}
            </button>
          ))}
        </div>
      </div>

      {/* Animations */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Animasyonlar</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAnimations(!config.animations)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              config.animations ? 'bg-primary' : 'bg-muted'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                config.animations ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
          <span className="text-sm text-muted-foreground">
            {config.animations ? 'Etkin' : 'Devre Dışı'}
          </span>
        </div>
      </div>
    </div>
  )
}

// Theme toggle button component
export function ThemeToggle() {
  const { config, setTheme } = useTheme()

  const toggleTheme = () => {
    if (config.theme === 'light') {
      setTheme('dark')
    } else if (config.theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
      title={`Tema: ${config.theme === 'light' ? 'Açık' : config.theme === 'dark' ? 'Koyu' : 'Sistem'}`}
    >
      {config.theme === 'light' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : config.theme === 'dark' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

// CSS utility for no animations
export const noAnimationsCSS = `
.no-animations *,
.no-animations *::before,
.no-animations *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
`

