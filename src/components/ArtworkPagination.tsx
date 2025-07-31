import { Paginator } from "primereact/paginator";

interface ArtworkPaginationProps {
  currentPage: number;
  rowsPerPage: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

export const ArtworkPagination = ({
  currentPage,
  rowsPerPage,
  totalRecords,
  onPageChange
}: ArtworkPaginationProps) => {
  return (
    <Paginator
      first={currentPage * rowsPerPage}
      rows={rowsPerPage}
      totalRecords={totalRecords}
      onPageChange={(e) => onPageChange(e.page)}
      className="mt-3"
      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      leftContent={
        <div className="text-sm text-600">
          Server-side pagination • Page {currentPage + 1}
        </div>
      }
    />
  );
};