import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-quick-recipe.bnxit.com'), // Update with actual domain if known, else usage placeholder or relative
  title: {
    default: 'CookNow | AI Personal Chef & Recipe Generator',
    template: '%s | CookNow AI',
  },
  description:
    'Turn your ingredients into 5-star recipes instantly with CookNow. Powered by minimal-waste culinary AI technology. Generate personalized, global cuisines in seconds.',
  keywords: [
    'AI Recipe Generator',
    'Cooking Assistant',
    'Recipe Finder',
    'Ingredients to Recipe',
    'Sustainable Cooking',
    'Food Waste Reduction',
    'Culinary AI',
    'Chef AI',
    'Personalized Recipes',
    'Dietary Planning',
    'Smart Kitchen',
    'Meal Ideas',
    'Dinner Inspiration',
    'Global Cuisine',
    'CookNow',
    'BNXIT',
    'Quick Recipes',
    'Easy Cooking',
    'Home Chef',
    'Gourmet AI',
    'Leftover Recipes',
    'Healthy Eating',
  ],
  authors: [{ name: 'BNXIT', url: 'https://www.bnxit.com' }],
  creator: 'BNXIT',
  publisher: 'BNXIT',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-quick-recipe.bnxit.com',
    title: 'CookNow | The #1 AI Recipe Generator',
    description:
      "Don't know what to cook? Let CookNow turn your ingredients into culinary masterpieces. Explore global flavors with our advanced AI chef.",
    siteName: 'CookNow AI',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'CookNow AI Aesthetic Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CookNow | AI Personal Chef',
    description:
      'Turn ingredients into recipes instantly. Powered by BNXIT AI technology.',
    creator: '@bnxit',
    images: ['/opengraph-image'],
  },
  category: 'food & drink',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
