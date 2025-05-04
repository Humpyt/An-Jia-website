"use client"

import React from 'react'
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination'

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CustomPagination({ currentPage, totalPages, onPageChange }: CustomPaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    
    // Always show first page
    pageNumbers.push(1)
    
    // Calculate range around current page
    let rangeStart = Math.max(2, currentPage - 1)
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1)
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pageNumbers.push('ellipsis-start')
    }
    
    // Add page numbers in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i)
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push('ellipsis-end')
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }
    
    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <Pagination className="my-8">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage - 1)
              }} 
            />
          </PaginationItem>
        )}

        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <span className="flex h-9 w-9 items-center justify-center">...</span>
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(page as number)
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage + 1)
              }} 
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
