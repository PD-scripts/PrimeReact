import { useState } from 'react';

interface RowSelectionPopupProps {
  onSubmit: (count: number) => void;
  onCancel: () => void;
  maxRows: number;
}

export const RowSelectionPopup = ({ onSubmit, onCancel, maxRows }: RowSelectionPopupProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = () => {
    const count = parseInt(inputValue, 10);
    if (count > 0 && count <= maxRows) {
      onSubmit(count);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="popup-overlay" onClick={onCancel}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-title">Select Rows</div>
        <input
          type="number"
          className="popup-input"
          placeholder={`Enter number (1-${maxRows})`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          min="1"
          max={maxRows}
          autoFocus
        />
        <div className="popup-buttons">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={!inputValue || parseInt(inputValue) <= 0 || parseInt(inputValue) > maxRows}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};