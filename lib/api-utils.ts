/**
 * API Route Handler Utilities
 * 
 * This file contains utility functions for Next.js API route handlers
 * to ensure they have the correct types and error handling.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Type for route handler context with params
 */
export type RouteHandlerContext<P extends Record<string, string> = {}> = {
  params: P;
};

/**
 * Type for route handler function
 */
export type RouteHandler<P extends Record<string, string> = {}> = (
  request: NextRequest,
  context: RouteHandlerContext<P>
) => Promise<NextResponse> | NextResponse;

/**
 * Wraps a route handler function to ensure it has the correct types
 * and provides consistent error handling
 * 
 * @param handler The route handler function to wrap
 * @returns A properly typed route handler function
 */
export function createRouteHandler<P extends Record<string, string> = {}>(
  handler: (
    request: Request | NextRequest,
    context: { params: P }
  ) => Promise<Response | NextResponse> | Response | NextResponse
): RouteHandler<P> {
  return async (request: NextRequest, context: RouteHandlerContext<P>) => {
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
export function GET<P extends Record<string, string> = {}>(
  handler: (
    request: Request | NextRequest,
    context: { params: P }
  ) => Promise<Response | NextResponse> | Response | NextResponse
): RouteHandler<P> {
  return createRouteHandler(handler);
}

/**
 * Creates a POST route handler with proper typing
 */
export function POST<P extends Record<string, string> = {}>(
  handler: (
    request: Request | NextRequest,
    context: { params: P }
  ) => Promise<Response | NextResponse> | Response | NextResponse
): RouteHandler<P> {
  return createRouteHandler(handler);
}

/**
 * Creates a PUT route handler with proper typing
 */
export function PUT<P extends Record<string, string> = {}>(
  handler: (
    request: Request | NextRequest,
    context: { params: P }
  ) => Promise<Response | NextResponse> | Response | NextResponse
): RouteHandler<P> {
  return createRouteHandler(handler);
}

/**
 * Creates a DELETE route handler with proper typing
 */
export function DELETE<P extends Record<string, string> = {}>(
  handler: (
    request: Request | NextRequest,
    context: { params: P }
  ) => Promise<Response | NextResponse> | Response | NextResponse
): RouteHandler<P> {
  return createRouteHandler(handler);
}

/**
 * Creates a PATCH route handler with proper typing
 */
export function PATCH<P extends Record<string, string> = {}>(
  handler: (
    request: Request | NextRequest,
    context: { params: P }
  ) => Promise<Response | NextResponse> | Response | NextResponse
): RouteHandler<P> {
  return createRouteHandler(handler);
}
