import { NextResponse } from "next/server"

// Using the correct type for Next.js 15 API route handlers
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Since we're using local data and not actually connecting to Supabase,
    // we can just return a success response for the Netlify build
    console.log(`Mock delete for property ID: ${params.id}`)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE handler:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
