import { DataTable } from "primereact/datatable";
import type { DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Artwork } from './types';
import { SelectionHeader } from './SelectionHeader';
import { titleBodyTemplate, artistBodyTemplate, inscriptionsBodyTemplate } from './ColumnTemplates';

interface ArtworkDataTableProps {
  artworks: Artwork[];
  selectedRows: Artwork[];
  onSelectionChange: (e: DataTableSelectionMultipleChangeEvent<Artwork[]>) => void;
  loading: boolean;
  allCurrentPageSelected: boolean;
  someCurrentPageSelected: boolean;
  onSelectAllCurrentPage: () => void;
  onDeselectAllCurrentPage: () => void;
  onChevronClick: (event: React.MouseEvent) => void;
}

export const ArtworkDataTable = ({
  artworks,
  selectedRows,
  onSelectionChange,
  loading,
  allCurrentPageSelected,
  someCurrentPageSelected,
  onSelectAllCurrentPage,
  onDeselectAllCurrentPage,
  onChevronClick
}: ArtworkDataTableProps) => {
  const selectionHeaderTemplate = () => (
    <SelectionHeader
      allCurrentPageSelected={allCurrentPageSelected}
      someCurrentPageSelected={someCurrentPageSelected}
      onSelectAllCurrentPage={onSelectAllCurrentPage}
      onDeselectAllCurrentPage={onDeselectAllCurrentPage}
      onChevronClick={onChevronClick}
    />
  );

  return (
    <DataTable
      value={artworks}
      dataKey="id"
      selectionMode="checkbox"
      selection={selectedRows}
      onSelectionChange={onSelectionChange}
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
  );
};