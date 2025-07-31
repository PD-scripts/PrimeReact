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
  const [showPopup, setShowPopup] = useState(false);
  const overlayRef = useRef<OverlayPanel>(null);
  const rowsPerPage = 10;

  const { 
    selectedIds, 
    selectMultiple, 
    deselectMultiple,
    clearSelection,
    selectedCount,
    toggleSelection,
    selectAll
  } = usePersistentSelection();

  const {
    artworks,
    totalRecords,
    loading,
    allArtworkIds,
    allFetchedArtworks,
    loadData,
    fetchArtworksForSelection
  } = useArtworkData(page, rowsPerPage);

  // Fetch artworks for deselection (from already selected items)
  const getArtworksForDeselection = async (count: number): Promise<number[]> => {
    const selectedArray = Array.from(selectedIds);
    return selectedArray.slice(0, count);
  };

  // Get selected rows for current page only
  const getSelectedRowsForCurrentPage = () => {
    return artworks.filter((artwork) => selectedIds.has(artwork.id));
  };

  // Handle selection change
  const handleSelectionChange = (e: DataTableSelectionMultipleChangeEvent<Artwork[]>) => {
    const selectedRows = e.value || [];
    const currentPageIds = artworks.map(artwork => artwork.id);
    
    // Get all currently selected IDs that are NOT on this page
    const selectedIdsNotOnCurrentPage = Array.from(selectedIds).filter(
      id => !currentPageIds.includes(id)
    );
    
    // Get the IDs of rows selected on current page
    const selectedIdsOnCurrentPage = selectedRows.map(row => row.id);
    
    // Find which rows were deselected on current page
    const previouslySelectedOnCurrentPage = currentPageIds.filter(id => selectedIds.has(id));
    const deselectedIds = previouslySelectedOnCurrentPage.filter(id => 
      !selectedIdsOnCurrentPage.includes(id)
    );

    // Remove deselected IDs from selection
    if (deselectedIds.length > 0) {
      deselectMultiple(deselectedIds);
    }

    // Add newly selected IDs
    const newlySelectedIds = selectedIdsOnCurrentPage.filter(id => 
      !selectedIds.has(id)
    );
    if (newlySelectedIds.length > 0) {
      selectMultiple(newlySelectedIds);
    }
  };

  // Handle popup submit for selecting/deselecting rows
  const handlePopupSubmit = async (count: number, mode: 'select' | 'deselect') => {
    if (mode === 'select') {
      // Start from current page and fetch as many pages as needed
      const startPage = page + 1;
      const artworksToSelect = await fetchArtworksForSelection(startPage, count);
      const idsToSelect = artworksToSelect.map(artwork => artwork.id);
      selectMultiple(idsToSelect);
    } else {
      // Deselect from currently selected items
      const idsToDeselect = await getArtworksForDeselection(count);
      deselectMultiple(idsToDeselect);
    }
  };

  // Handle select all on current page
  const handleSelectAllCurrentPage = () => {
    const currentPageIds = artworks.map(artwork => artwork.id);
    selectMultiple(currentPageIds);
  };

  // Handle deselect all on current page
  const handleDeselectAllCurrentPage = () => {
    const currentPageIds = artworks.map(artwork => artwork.id);
    const selectedOnCurrentPage = currentPageIds.filter(id => selectedIds.has(id));
    if (selectedOnCurrentPage.length > 0) {
      deselectMultiple(selectedOnCurrentPage);
    }
  };

  // Check if all rows on current page are selected
  const isAllCurrentPageSelected = () => {
    return artworks.length > 0 && artworks.every(artwork => selectedIds.has(artwork.id));
  };

  // Handle chevron click
  const handleChevronClick = (event: React.MouseEvent) => {
    overlayRef.current?.toggle(event);
  };

  const allCurrentPageSelected = isAllCurrentPageSelected();
  const someCurrentPageSelected = artworks.some(artwork => selectedIds.has(artwork.id));
  const hasSelectedOnCurrentPage = artworks.some(artwork => selectedIds.has(artwork.id));

  return (
    <div className="card">
      {/* Selection Info */}
      <SelectionInfo selectedCount={selectedCount} />

      {/* Action Buttons */}
      <ActionButtons
        onSelectAllCurrentPage={handleSelectAllCurrentPage}
        onDeselectAllCurrentPage={handleDeselectAllCurrentPage}
        isAllCurrentPageSelected={allCurrentPageSelected}
        hasSelectedOnCurrentPage={hasSelectedOnCurrentPage}
        currentPage={page}
        totalPages={Math.ceil(totalRecords / rowsPerPage)}
        totalRecords={totalRecords}
      />

      {/* Data Table */}
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

      {/* Server-side Pagination */}
      <ArtworkPagination
        currentPage={page}
        rowsPerPage={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={setPage}
      />

      {/* Overlay Panel for Row Selection */}
      <RowSelectionPopup
        visible={showPopup}
        onHide={() => setShowPopup(false)}
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