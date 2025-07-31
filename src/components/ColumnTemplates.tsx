import { Artwork } from './types';

export const titleBodyTemplate = (rowData: Artwork) => {
  return (
    <div style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
      {rowData.title}
    </div>
  );
};

export const artistBodyTemplate = (rowData: Artwork) => {
  return (
    <div style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
      {rowData.artist_display}
    </div>
  );
};

export const inscriptionsBodyTemplate = (rowData: Artwork) => {
  return (
    <div style={{ maxWidth: '150px', wordWrap: 'break-word' }}>
      {rowData.inscriptions}
    </div>
  );
};