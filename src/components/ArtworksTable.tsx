import { useState, useRef } from "react";
import type { DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { usePersistentSelection } from "../hooks/usePersistentSelection";
import { RowSelectionPopup } from "./RowSelectionPopup";
import { Artwork } from "./types";
import { SelectionInfo } from "./SelectionInfo";
import { ActionButtons } from "./ActionButtons";
import { ArtworkDataTable } from "./ArtworkDataTable";
import { ArtworkPagination } from "./ArtworkPagination";
import { useArtworkData } from "./useArtworkData";

export const ArtworksTable = () => {
  const [page, setPage] = useState(0);
  const overlayRef = useRef<OverlayPanel>(null);
  const rowsPerPage = 10;

  const { 
    selectedIds, 
    selectMultiple, 
    deselectMultiple,
    selectedCount
  } = usePersistentSelection();

  const {
    artworks,
    totalRecords,
    loading,
    fetchArtworksForSelection
  } = useArtworkData(page, rowsPerPage);

  const getArtworksForDeselection = async (count: number): Promise<number[]> => {
    const selectedArray = Array.from(selectedIds);
    return selectedArray.slice(0, count);
  };

  const getSelectedRowsForCurrentPage = () => {
    return artworks.filter((artwork) => selectedIds.has(artwork.id));
  };

  const handleSelectionChange = (e: DataTableSelectionMultipleChangeEvent<Artwork[]>) => {
    const selectedRows = e.value || [];
    const currentPageIds = artworks.map(artwork => artwork.id);
    
    const selectedIdsOnCurrentPage = selectedRows.map(row => row.id);
    
    const previouslySelectedOnCurrentPage = currentPageIds.filter(id => selectedIds.has(id));
    const deselectedIds = previouslySelectedOnCurrentPage.filter(id => 
      !selectedIdsOnCurrentPage.includes(id)
    );

    if (deselectedIds.length > 0) {
      deselectMultiple(deselectedIds);
    }

    const newlySelectedIds = selectedIdsOnCurrentPage.filter(id => 
      !selectedIds.has(id)
    );
    if (newlySelectedIds.length > 0) {
      selectMultiple(newlySelectedIds);
    }
  };

  const handlePopupSubmit = async (count: number, mode: 'select' | 'deselect') => {
    if (mode === 'select') {
      const startPage = page + 1;
      const artworksToSelect = await fetchArtworksForSelection(startPage, count);
      const idsToSelect = artworksToSelect.map(artwork => artwork.id);
      selectMultiple(idsToSelect);
    } else {
      const idsToDeselect = await getArtworksForDeselection(count);
      deselectMultiple(idsToDeselect);
    }
  };

  const handleSelectAllCurrentPage = () => {
    const currentPageIds = artworks.map(artwork => artwork.id);
    selectMultiple(currentPageIds);
  };

  const handleDeselectAllCurrentPage = () => {
    const currentPageIds = artworks.map(artwork => artwork.id);
    const selectedOnCurrentPage = currentPageIds.filter(id => selectedIds.has(id));
    if (selectedOnCurrentPage.length > 0) {
      deselectMultiple(selectedOnCurrentPage);
    }
  };

  const isAllCurrentPageSelected = () => {
    return artworks.length > 0 && artworks.every(artwork => selectedIds.has(artwork.id));
  };

  const handleChevronClick = (event: React.MouseEvent) => {
    overlayRef.current?.toggle(event);
  };

  const allCurrentPageSelected = isAllCurrentPageSelected();
  const someCurrentPageSelected = artworks.some(artwork => selectedIds.has(artwork.id));
  const hasSelectedOnCurrentPage = artworks.some(artwork => selectedIds.has(artwork.id));

  return (
    <div className="card">
  
      <SelectionInfo selectedCount={selectedCount} />

      <ActionButtons
        onSelectAllCurrentPage={handleSelectAllCurrentPage}
        onDeselectAllCurrentPage={handleDeselectAllCurrentPage}
        isAllCurrentPageSelected={allCurrentPageSelected}
        hasSelectedOnCurrentPage={hasSelectedOnCurrentPage}
        currentPage={page}
        totalPages={Math.ceil(totalRecords / rowsPerPage)}
        totalRecords={totalRecords}
      />

      <ArtworkDataTable
        artworks={artworks}
        selectedRows={getSelectedRowsForCurrentPage()}
        onSelectionChange={handleSelectionChange}
        loading={loading}
        allCurrentPageSelected={allCurrentPageSelected}
        someCurrentPageSelected={someCurrentPageSelected}
        onSelectAllCurrentPage={handleSelectAllCurrentPage}
        onDeselectAllCurrentPage={handleDeselectAllCurrentPage}
        onChevronClick={handleChevronClick}
      />

      <ArtworkPagination
        currentPage={page}
        rowsPerPage={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={setPage}
      />

      <RowSelectionPopup
        onHide={() => overlayRef.current?.hide()}
        onSubmit={handlePopupSubmit}
        overlayRef={overlayRef}
        currentPageRowCount={artworks.length}
        selectedOnCurrentPage={getSelectedRowsForCurrentPage().length}
        totalRecords={totalRecords}
        totalSelectedCount={selectedCount}
      />
    </div>
  );
};