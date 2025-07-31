interface SelectionInfoProps {
  selectedCount: number;
}

export const SelectionInfo = ({ selectedCount }: SelectionInfoProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="selection-info">
      {selectedCount.toLocaleString()} row{selectedCount !== 1 ? 's' : ''} selected across all pages
    </div>
  );
};