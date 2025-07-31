import { Button } from "primereact/button";

interface SelectionHeaderProps {
  allCurrentPageSelected: boolean;
  someCurrentPageSelected: boolean;
  onSelectAllCurrentPage: () => void;
  onDeselectAllCurrentPage: () => void;
  onChevronClick: (event: React.MouseEvent) => void;
}

export const SelectionHeader = ({
  allCurrentPageSelected,
  someCurrentPageSelected,
  onSelectAllCurrentPage,
  onDeselectAllCurrentPage,
  onChevronClick
}: SelectionHeaderProps) => {
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
            onSelectAllCurrentPage();
          } else {
            onDeselectAllCurrentPage();
          }
        }}
        style={{ marginRight: '4px' }}
      />
      <Button
        icon="pi pi-chevron-down"
        className="p-button-text p-button-plain p-button-sm"
        onClick={onChevronClick}
        tooltip="Advanced selection options"
        tooltipOptions={{ position: 'top' }}
      />
    </div>
  );
};