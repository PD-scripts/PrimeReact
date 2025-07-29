import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import type { DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
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
  const rowsPerPage = 10;

  const { 
    selectedIds, 
    selectMultiple, 
    clearSelection,
    selectedCount 
  } = usePersistentSelection();

  // Fetch page data
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
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  // Get selected rows for current page
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
    
    // Combine selections from other pages with current page selections
    const allSelectedIds = [...selectedIdsNotOnCurrentPage, ...selectedIdsOnCurrentPage];
    
    // Update selection
    selectMultiple(allSelectedIds);
  };

  // Handle popup submit
  const handlePopupSubmit = (count: number) => {
    const idsToSelect = artworks.slice(0, count).map((artwork) => artwork.id);
    selectMultiple([...Array.from(selectedIds), ...idsToSelect]);
    setShowPopup(false);
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
          {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected across all pages
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-content-between align-items-center mb-3">
        <div className="flex gap-2">
          <Button
            label="Select Rows"
            icon="pi pi-check-square"
            onClick={() => setShowPopup(true)}
            size="small"
            outlined
          />
          <Button
            label="Clear Selection"
            icon="pi pi-times"
            onClick={clearSelection}
            size="small"
            severity="secondary"
            outlined
            disabled={selectedCount === 0}
          />
        </div>
        <div className="text-sm text-600">
          Page {page + 1} of {Math.ceil(totalRecords / rowsPerPage)}
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
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3rem' }}
          bodyStyle={{ textAlign: 'center' }}
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

      {/* Pagination */}
      <Paginator
        first={page * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={(e) => setPage(e.page)}
        className="mt-3"
      />

      {/* Popup */}
      {showPopup && (
        <RowSelectionPopup
          onSubmit={handlePopupSubmit}
          onCancel={() => setShowPopup(false)}
          maxRows={artworks.length}
        />
      )}
    </div>
  );
};