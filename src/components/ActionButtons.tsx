import { Button } from "primereact/button";

interface ActionButtonsProps {
  onSelectAllCurrentPage: () => void;
  onDeselectAllCurrentPage: () => void;
  isAllCurrentPageSelected: boolean;
  hasSelectedOnCurrentPage: boolean;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
}

export const ActionButtons = ({
  onSelectAllCurrentPage,
  onDeselectAllCurrentPage,
  isAllCurrentPageSelected,
  hasSelectedOnCurrentPage,
  currentPage,
  totalPages,
  totalRecords
}: ActionButtonsProps) => {
  return (
    <div className="flex justify-content-between align-items-center mb-3">
      <div className="flex gap-2">
        <Button
          label="Select All Current Page"
          icon="pi pi-check-square"
          onClick={onSelectAllCurrentPage}
          size="small"
          severity="info"
          outlined
          disabled={isAllCurrentPageSelected}
        />
        <Button
          label="Deselect All Current Page"
          icon="pi pi-minus-circle"
          onClick={onDeselectAllCurrentPage}
          size="small"
          severity="warning"
          outlined
          disabled={!hasSelectedOnCurrentPage}
        />
      </div>
      <div className="text-sm text-600">
        Page {currentPage + 1} of {totalPages} • Total: {totalRecords.toLocaleString()} records
      </div>
    </div>
  );
};