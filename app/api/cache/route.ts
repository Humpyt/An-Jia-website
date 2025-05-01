import { NextRequest, NextResponse } from 'next/server';
import { clearCache, getCacheStats } from '@/lib/wordpress';

/**
 * GET handler for cache statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Get cache statistics
    const stats = getCacheStats();
    
    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error: any) {
    console.error('Error getting cache stats:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to get cache statistics'
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler for cache clearing
 */
export async function POST(request: NextRequest) {
  try {
    // Get the cache type from the request body
    const { cacheType = 'all' } = await request.json();
    
    // Clear the specified cache
    const result = clearCache(cacheType);
    
    return NextResponse.json({
      success: true,
      message: `Successfully cleared ${result.total} cached items`,
      result
    });
  } catch (error: any) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to clear cache'
      },
      { status: 500 }
    );
  }
}
