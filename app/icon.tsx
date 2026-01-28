import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          borderRadius: '20%',
          color: '#D4AF37',
          fontFamily: 'serif',
          fontWeight: 900,
          fontSize: 24,
          lineHeight: 1,
        }}
      >
        C
      </div>
    ),
    {
      ...size,
    }
  )
}
