import { NextResponse } from "next/server"
import { DELETE as createDeleteHandler } from "@/lib/api-utils"

// Using our custom route handler wrapper for correct typing
export const DELETE = createDeleteHandler<{ id: string }>(
  async (request, { params }) => {
    // Since we're using local data and not actually connecting to Supabase,
    // we can just return a success response for the Netlify build
    console.log(`Mock delete for property ID: ${params.id}`)

    return NextResponse.json({ success: true })
  }
)
