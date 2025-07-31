import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import type { DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { fetchArtworks } from "../services/api";
import { usePersistentSelection } from "../hooks/usePersistentSelection";
import { RowSelectionPopup } from "./RowSelectionPopup";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

export const ArtworksTable = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [allArtworkIds, setAllArtworkIds] = useState<Set<number>>(new Set());
  const [allFetchedArtworks, setAllFetchedArtworks] = useState<Map<number, Artwork>>(new Map());
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

  // Fetch page data - TRUE server-side pagination
  const loadData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = await fetchArtworks(pageNumber + 1);
      const mapped = data.data.map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled',
        place_of_origin: item.place_of_origin || 'Unknown',
        artist_display: item.artist_display || 'Unknown Artist',
        inscriptions: item.inscriptions || 'None',
        date_start: item.date_start || 0,
        date_end: item.date_end || 0,
      }));
      setArtworks(mapped);
      setTotalRecords(data.pagination.total);
      
      // Track all artwork IDs we've seen
      const newIds = mapped.map(artwork => artwork.id);
      setAllArtworkIds(prev => new Set([...prev, ...newIds]));
      
      // Store all fetched artworks
      const newArtworksMap = new Map(allFetchedArtworks);
      mapped.forEach(artwork => {
        newArtworksMap.set(artwork.id, artwork);
      });
      setAllFetchedArtworks(newArtworksMap);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch multiple pages for cross-page selection
  const fetchArtworksForSelection = async (startPage: number, count: number): Promise<Artwork[]> => {
    const artworksToSelect: Artwork[] = [];
    let currentPage = startPage;
    let remainingCount = count;
    
    while (remainingCount > 0 && currentPage <= Math.ceil(totalRecords / rowsPerPage)) {
      try {
        const data = await fetchArtworks(currentPage);
        const mapped = data.data.map((item: any) => ({
          id: item.id,
          title: item.title || 'Untitled',
          place_of_origin: item.place_of_origin || 'Unknown',
          artist_display: item.artist_display || 'Unknown Artist',
          inscriptions: item.inscriptions || 'None',
          date_start: item.date_start || 0,
          date_end: item.date_end || 0,
        }));
        
        const artworksToTake = mapped.slice(0, remainingCount);
        artworksToSelect.push(...artworksToTake);
        remainingCount -= artworksToTake.length;
        currentPage++;
        
        // Update our stored artworks
        const newArtworksMap = new Map(allFetchedArtworks);
        mapped.forEach(artwork => {
          newArtworksMap.set(artwork.id, artwork);
        });
        setAllFetchedArtworks(newArtworksMap);
        
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error);
        break;
      }
    }
    
    return artworksToSelect;
  };

  // Fetch artworks for deselection (from already selected items)
  const getArtworksForDeselection = async (count: number): Promise<number[]> => {
    const selectedArray = Array.from(selectedIds);
    return selectedArray.slice(0, count);
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

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

  // Custom header template with chevron icon and select all functionality
  const selectionHeaderTemplate = () => {
    const allCurrentPageSelected = isAllCurrentPageSelected();
    const someCurrentPageSelected = artworks.some(artwork => selectedIds.has(artwork.id));

    return (
      <div className="flex align-items-center justify-content-center gap-1">
        <input
          type="checkbox"
          checked={allCurrentPageSelected}
          ref={(el) => {
            if (el) {
              el.indeterminate = someCurrentPageSelected && !allCurrentPageSelected;
            }
          }}
          onChange={(e) => {
            if (e.target.checked) {
              handleSelectAllCurrentPage();
            } else {
              handleDeselectAllCurrentPage();
            }
          }}
          style={{ marginRight: '4px' }}
        />
        <Button
          icon="pi pi-chevron-down"
          className="p-button-text p-button-plain p-button-sm"
          onClick={handleChevronClick}
          tooltip="Advanced selection options"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  // Custom body templates for better display
  const titleBodyTemplate = (rowData: Artwork) => {
    return (
      <div style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
        {rowData.title}
      </div>
    );
  };

  const artistBodyTemplate = (rowData: Artwork) => {
    return (
      <div style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
        {rowData.artist_display}
      </div>
    );
  };

  const inscriptionsBodyTemplate = (rowData: Artwork) => {
    return (
      <div style={{ maxWidth: '150px', wordWrap: 'break-word' }}>
        {rowData.inscriptions}
      </div>
    );
  };

  return (
    <div className="card">
      {/* Selection Info */}
      {selectedCount > 0 && (
        <div className="selection-info">
          {selectedCount.toLocaleString()} row{selectedCount !== 1 ? 's' : ''} selected across all pages
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-content-between align-items-center mb-3">
        <div className="flex gap-2">
          <Button
            label="Select All Current Page"
            icon="pi pi-check-square"
            onClick={handleSelectAllCurrentPage}
            size="small"
            severity="info"
            outlined
            disabled={isAllCurrentPageSelected()}
          />
          <Button
            label="Deselect All Current Page"
            icon="pi pi-minus-circle"
            onClick={handleDeselectAllCurrentPage}
            size="small"
            severity="warning"
            outlined
            disabled={!artworks.some(artwork => selectedIds.has(artwork.id))}
          />
        </div>
        <div className="text-sm text-600">
          Page {page + 1} of {Math.ceil(totalRecords / rowsPerPage)} • Total: {totalRecords.toLocaleString()} records
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        value={artworks}
        dataKey="id"
        selectionMode="checkbox"
        selection={getSelectedRowsForCurrentPage()}
        onSelectionChange={handleSelectionChange}
        loading={loading}
        emptyMessage="No artworks found"
        scrollable
        scrollHeight="600px"
        lazy={true}
        paginator={false}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3rem' }}
          bodyStyle={{ textAlign: 'center' }}
          header={selectionHeaderTemplate}
        />
        <Column 
          field="title" 
          header="Title" 
          sortable 
          body={titleBodyTemplate}
          style={{ minWidth: '200px' }}
        />
        <Column 
          field="place_of_origin" 
          header="Origin" 
          style={{ minWidth: '150px' }}
        />
        <Column 
          field="artist_display" 
          header="Artist" 
          body={artistBodyTemplate}
          style={{ minWidth: '200px' }}
        />
        <Column 
          field="inscriptions" 
          header="Inscriptions" 
          body={inscriptionsBodyTemplate}
          style={{ minWidth: '150px' }}
        />
        <Column 
          field="date_start" 
          header="Date Start" 
          style={{ minWidth: '100px' }}
        />
        <Column 
          field="date_end" 
          header="Date End" 
          style={{ minWidth: '100px' }}
        />
      </DataTable>

      {/* Server-side Pagination */}
      <Paginator
        first={page * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={(e) => {
          setPage(e.page);
          // This triggers useEffect which calls loadData with new page
        }}
        className="mt-3"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        leftContent={
          <div className="text-sm text-600">
            Server-side pagination • Page {page + 1}
          </div>
        }
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