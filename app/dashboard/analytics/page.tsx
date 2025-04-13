import AnalyticsClient from './client'

// Export metadata and configuration
export const metadata = {
  title: 'Analytics | Dashboard',
  description: 'Analytics dashboard for property management'
}

// Configure page behavior
export const fetchCache = 'force-no-store'
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default function AnalyticsPage() {
  return <AnalyticsClient />
}
