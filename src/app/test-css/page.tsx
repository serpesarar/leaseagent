export default function TestCSSPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #faf5ff)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          🎉 CSS Test Sayfası - Çalışıyor!
        </h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Mavi Kart
            </h3>
            <p>Bu renk göründüyse CSS çalışıyor!</p>
          </div>
          
          <div style={{
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Yeşil Kart
            </h3>
            <p>Renkler ve layout düzgün!</p>
          </div>
          
          <div style={{
            backgroundColor: '#8b5cf6',
            color: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Mor Kart
            </h3>
            <p>Inline CSS ile çalışıyor!</p>
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <a 
            href="/dashboard" 
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-block',
              marginRight: '1rem'
            }}
          >
            Dashboard'a Git
          </a>
          
          <a 
            href="/" 
            style={{
              backgroundColor: '#6b7280',
              color: '#ffffff',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-block'
            }}
          >
            Ana Sayfa
          </a>
        </div>
        
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#374151', fontSize: '0.875rem' }}>
            Bu sayfada renkler görünüyorsa sorun Tailwind CSS'de. 
            Inline CSS kullanarak çözüyoruz.
          </p>
        </div>
      </div>
    </div>
  )
}
