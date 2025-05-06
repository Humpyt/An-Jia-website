import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  // Handle previous page click
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Handle next page click
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display (show max 5 pages with ellipsis)
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      // If 7 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
        // Add pages and ellipsis
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
      }
      // Adjust if at the end
      else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
        // Add ellipsis and pages
        pages.push('ellipsis');
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
      // Middle case
      else {
        // Add ellipsis, pages, and ellipsis
        pages.push('ellipsis');
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        className="rounded-full w-10 h-10"
        onClick={handlePrevious}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {pageNumbers.map((page, index) => (
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center">
            &hellip;
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            className={`w-10 h-10 rounded-full ${currentPage === page ? "bg-rose-500 hover:bg-rose-600" : ""}`}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </Button>
        )
      ))}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        className="rounded-full w-10 h-10"
        onClick={handleNext}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
