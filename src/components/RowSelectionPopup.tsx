import { useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';

interface RowSelectionPopupProps {
  onHide: () => void;
  onSubmit: (count: number, mode: 'select' | 'deselect') => void;
  overlayRef: React.RefObject<OverlayPanel>;
  currentPageRowCount: number;
  selectedOnCurrentPage: number;
  totalRecords: number;
  totalSelectedCount: number;
}

export const RowSelectionPopup = ({ 
  onHide, 
  onSubmit, 
  overlayRef, 
  currentPageRowCount,
  selectedOnCurrentPage,
  totalRecords,
  totalSelectedCount
}: RowSelectionPopupProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [mode, setMode] = useState<'select' | 'deselect'>('select');

  const handleSubmit = () => {
    const count = parseInt(inputValue, 10);
    if (count > 0) {
      onSubmit(count, mode);
      setInputValue('');
      onHide();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getMaxValue = () => {
    return mode === 'select' ? totalRecords : totalSelectedCount;
  };

  const getPlaceholder = () => {
    const maxValue = getMaxValue();
    return mode === 'select' 
      ? `Select up to ${maxValue} rows across all pages...` 
      : `Deselect up to ${maxValue} selected rows...`;
  };

  const isSubmitDisabled = () => {
    const count = parseInt(inputValue, 10);
    const maxValue = getMaxValue();
    return !inputValue || count <= 0 || count > maxValue;
  };

  const handleClose = () => {
    setInputValue('');
    onHide();
  };

  return (
    <OverlayPanel
      ref={overlayRef}
      onHide={onHide}
      className="custom-overlay-panel"
    >
      <div className="row-selection-container">
        {/* Header */}
        <div className="row-selection-header">
          <h4 className="row-selection-title">
            Row Selection
          </h4>
        </div>
        
        {/* Mode Selection */}
        <div className="row-selection-mode-container">
          <div className="row-selection-mode-options">
            <div className="row-selection-mode-option">
              <RadioButton
                inputId="select-mode"
                name="mode"
                value="select"
                onChange={(e) => setMode(e.value)}
                checked={mode === 'select'}
              />
              <label htmlFor="select-mode" className="row-selection-mode-label">Select</label>
            </div>
            <div className="row-selection-mode-option">
              <RadioButton
                inputId="deselect-mode"
                name="mode"
                value="deselect"
                onChange={(e) => setMode(e.value)}
                checked={mode === 'deselect'}
                disabled={totalSelectedCount === 0}
              />
              <label 
                htmlFor="deselect-mode" 
                className={`row-selection-mode-label ${totalSelectedCount === 0 ? 'disabled' : ''}`}
              >
                Deselect
              </label>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <div className="row-selection-info">
          {mode === 'select' 
            ? (
              <div>
                <div><strong>Total records:</strong> {totalRecords.toLocaleString()}</div>
                <div><strong>Current page:</strong> {currentPageRowCount} rows</div>
                <div><strong>Already selected:</strong> {totalSelectedCount.toLocaleString()} rows</div>
              </div>
            )
            : (
              <div>
                <div><strong>Total selected:</strong> {totalSelectedCount.toLocaleString()} rows</div>
                <div><strong>Selected on current page:</strong> {selectedOnCurrentPage} rows</div>
              </div>
            )
          }
        </div>

        {/* Number Input */}
        <InputText
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={getPlaceholder()}
          type="number"
          min="1"
          max={getMaxValue()}
          className="row-selection-input"
          autoFocus
        />
        
        {/* Validation Message */}
        {inputValue && parseInt(inputValue, 10) > getMaxValue() && (
          <div className="row-selection-validation-error">
            Maximum {getMaxValue().toLocaleString()} rows can be {mode}ed
          </div>
        )}

        {/* Help text for cross-page selection */}
        {mode === 'select' && inputValue && parseInt(inputValue, 10) > currentPageRowCount && (
          <div className="row-selection-help-text">
            Will select rows across multiple pages starting from current page
          </div>
        )}

        <div className="row-selection-actions">
          <Button
            label="Cancel"
            onClick={handleClose}
            outlined
            className="p-button-sm p-button-secondary row-selection-button"
          />
          <Button
            label={mode === 'select' ? 'Select' : 'Deselect'}
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            className={`p-button-sm row-selection-button ${
              mode === 'select' ? 'row-selection-button-select' : 'row-selection-button-deselect'
            }`}
          />
        </div>
      </div>
    </OverlayPanel>
  );
};