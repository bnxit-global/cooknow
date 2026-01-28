import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'CookNow AI - Turn Ingredients into Recipes'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(to bottom, #000000, #1a1a1a)',
        color: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          padding: '60px 100px',
          background: 'rgba(0,0,0,0.5)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Logo Title */}
        <div
          style={{
            fontSize: 130,
            fontWeight: 900,
            background: 'linear-gradient(to right, #D4AF37, #FFD700, #FFB84C)',
            backgroundClip: 'text',
            color: 'transparent',
            fontFamily: 'serif',
            marginBottom: 20,
            letterSpacing: '-0.05em',
          }}
        >
          CookNow
        </div>

        <div
          style={{
            height: 2,
            width: 150,
            background: '#D4AF37',
            marginBottom: 20,
            opacity: 0.6,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: '#f0f0f0',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          Culinary Intelligence
        </div>
      </div>

      {/* Footer Brand */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          fontSize: 24,
          color: '#666',
          letterSpacing: '0.1em',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span>POWERED BY</span>
        <span style={{ color: '#D4AF37', marginLeft: 12, fontWeight: 900 }}>
          BNXIT
        </span>
      </div>
    </div>,
    {
      ...size,
    }
  )
}
