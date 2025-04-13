// This file configures the route segment for the import page
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

// This tells Next.js to skip static generation for this route
export const generateStaticParams = () => {
  return []
}
