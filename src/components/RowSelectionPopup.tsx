import { useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';

interface RowSelectionPopupProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (count: number, mode: 'select' | 'deselect') => void;
  overlayRef: React.RefObject<OverlayPanel>;
  currentPageRowCount: number;
  selectedOnCurrentPage: number;
  totalRecords: number;
  totalSelectedCount: number;
}

export const RowSelectionPopup = ({ 
  visible, 
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
      style={{ 
        width: '360px',
        padding: '0',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
      }}
      className="custom-overlay-panel"
    >
      <div style={{ padding: '1rem' }}>
        {/* Header with close button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: '0', fontSize: '16px', fontWeight: '600' }}>
            Row Selection
          </h4>
          <Button
            icon="pi pi-times"
            onClick={handleClose}
            className="p-button-text p-button-plain p-button-sm"
            style={{ 
              padding: '0.25rem',
              width: '24px',
              height: '24px',
              minWidth: '24px'
            }}
            tooltip="Close"
            tooltipOptions={{ position: 'left' }}
          />
        </div>
        
        {/* Mode Selection */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RadioButton
                inputId="select-mode"
                name="mode"
                value="select"
                onChange={(e) => setMode(e.value)}
                checked={mode === 'select'}
              />
              <label htmlFor="select-mode" style={{ fontSize: '14px' }}>Select</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                style={{ 
                  fontSize: '14px',
                  color: totalSelectedCount === 0 ? '#999' : 'inherit'
                }}
              >
                Deselect
              </label>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <div style={{ 
          marginBottom: '1rem', 
          fontSize: '12px', 
          color: '#666',
          backgroundColor: '#f8f9fa',
          padding: '0.75rem',
          borderRadius: '4px',
          lineHeight: '1.4'
        }}>
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
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          autoFocus
        />
        
        {/* Validation Message */}
        {inputValue && parseInt(inputValue, 10) > getMaxValue() && (
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '12px', 
            color: '#dc3545' 
          }}>
            Maximum {getMaxValue().toLocaleString()} rows can be {mode}ed
          </div>
        )}

        {/* Help text for cross-page selection */}
        {mode === 'select' && inputValue && parseInt(inputValue, 10) > currentPageRowCount && (
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '12px', 
            color: '#0066cc',
            fontStyle: 'italic'
          }}>
            Will select rows across multiple pages starting from current page
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          <Button
            label="Cancel"
            onClick={handleClose}
            outlined
            style={{
              padding: '0.5rem 1rem',
              fontSize: '14px',
              borderRadius: '4px'
            }}
            className="p-button-sm p-button-secondary"
          />
          <Button
            label={mode === 'select' ? 'Select' : 'Deselect'}
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '14px',
              borderRadius: '4px',
              backgroundColor: mode === 'select' ? '#007bff' : '#dc3545',
              border: `1px solid ${mode === 'select' ? '#007bff' : '#dc3545'}`,
              color: 'white'
            }}
            className="p-button-sm"
          />
        </div>
      </div>
    </OverlayPanel>
  );
};