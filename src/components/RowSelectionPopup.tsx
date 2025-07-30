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
}

export const RowSelectionPopup = ({ 
  visible, 
  onHide, 
  onSubmit, 
  overlayRef, 
  currentPageRowCount,
  selectedOnCurrentPage 
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
    return mode === 'select' ? currentPageRowCount : selectedOnCurrentPage;
  };

  const getPlaceholder = () => {
    const maxValue = getMaxValue();
    return mode === 'select' 
      ? `Select up to ${maxValue} rows...` 
      : `Deselect up to ${maxValue} rows...`;
  };

  const isSubmitDisabled = () => {
    const count = parseInt(inputValue, 10);
    const maxValue = getMaxValue();
    return !inputValue || count <= 0 || count > maxValue;
  };

  return (
    <OverlayPanel
      ref={overlayRef}
      onHide={onHide}
      style={{ 
        width: '320px',
        padding: '0',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
      }}
      className="custom-overlay-panel"
    >
      <div style={{ padding: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '16px', fontWeight: '600' }}>
            Row Selection
          </h4>
          
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
                  disabled={selectedOnCurrentPage === 0}
                />
                <label 
                  htmlFor="deselect-mode" 
                  style={{ 
                    fontSize: '14px',
                    color: selectedOnCurrentPage === 0 ? '#999' : 'inherit'
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
            padding: '0.5rem',
            borderRadius: '4px'
          }}>
            {mode === 'select' 
              ? `${currentPageRowCount} rows available on current page`
              : `${selectedOnCurrentPage} rows selected on current page`
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
              Maximum {getMaxValue()} rows can be {mode}ed on this page
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
          <Button
            label="Cancel"
            onClick={onHide}
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