/**
 * API Route Handler Utilities
 *
 * This file contains utility functions for Next.js API route handlers
 * to ensure they have the correct types and error handling.
 */

import { NextRequest, NextResponse } from 'next/server';

// Import Next.js types directly to ensure compatibility
type NextRouteHandler = (
  request: Request | NextRequest,
  context?: any
) => Promise<Response | NextResponse> | Response | NextResponse;

/**
 * Wraps a route handler function to ensure it has the correct types
 * and provides consistent error handling
 *
 * @param handler The route handler function to wrap
 * @returns A properly typed route handler function
 */
export function createRouteHandler(
  handler: (
    request: Request | NextRequest,
    context?: any
  ) => Promise<Response | NextResponse> | Response | NextResponse
): NextRouteHandler {
  return async (request: Request | NextRequest, context?: any) => {
    try {
      // Call the original handler with the correct types
      return await handler(request, context);
    } catch (error) {
      console.error('API Route Error:', error);

      // Return a consistent error response
      return NextResponse.json(
        {
          error: 'An error occurred processing your request',
          message: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Creates a GET route handler with proper typing
 */
export function GET(
  handler: (
    request: Request | NextRequest,
    context?: any
  ) => Promise<Response | NextResponse> | Response | NextResponse
): NextRouteHandler {
  return createRouteHandler(handler);
}

/**
 * Creates a POST route handler with proper typing
 */
export function POST(
  handler: (
    request: Request | NextRequest,
    context?: any
  ) => Promise<Response | NextResponse> | Response | NextResponse
): NextRouteHandler {
  return createRouteHandler(handler);
}

/**
 * Creates a PUT route handler with proper typing
 */
export function PUT(
  handler: (
    request: Request | NextRequest,
    context?: any
  ) => Promise<Response | NextResponse> | Response | NextResponse
): NextRouteHandler {
  return createRouteHandler(handler);
}

/**
 * Creates a DELETE route handler with proper typing
 */
export function DELETE(
  handler: (
    request: Request | NextRequest,
    context?: any
  ) => Promise<Response | NextResponse> | Response | NextResponse
): NextRouteHandler {
  return createRouteHandler(handler);
}

/**
 * Creates a PATCH route handler with proper typing
 */
export function PATCH(
  handler: (
    request: Request | NextRequest,
    context?: any
  ) => Promise<Response | NextResponse> | Response | NextResponse
): NextRouteHandler {
  return createRouteHandler(handler);
}
