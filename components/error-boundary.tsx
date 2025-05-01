'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Error boundary component to catch and handle errors in the component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  handleRefresh = () => {
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="container py-12">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Content</h2>
            <p className="text-red-600 mb-4">
              We encountered an error while loading this content. Please try refreshing the page.
            </p>
            <div className="flex gap-4">
              <button
                onClick={this.handleRefresh}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Refresh Page
              </button>
              <Link href="/properties" className="px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-700">
                Back to Properties
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
