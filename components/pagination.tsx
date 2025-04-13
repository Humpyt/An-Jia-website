import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  totalPages: number
  currentPage: number
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      <Button variant="outline" size="icon" disabled={currentPage === 1} className="rounded-full w-10 h-10">
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="icon"
          className={`w-10 h-10 rounded-full ${currentPage === page ? "bg-rose-500 hover:bg-rose-600" : ""}`}
        >
          {page}
        </Button>
      ))}

      <Button variant="outline" size="icon" disabled={currentPage === totalPages} className="rounded-full w-10 h-10">
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
