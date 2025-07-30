# Artworks Gallery - React Data Table with Persistent Selection

A React application showcasing server-side pagination with persistent row selection across pages, built with PrimeReact components and TypeScript.

## Features

### 🎨 **Artwork Data Display**
- Displays artwork data from the Art Institute of Chicago API
- Shows artwork title, origin, artist, inscriptions, and date ranges
- Responsive table design with proper word wrapping
- Loading states and error handling

### 📊 **Server-Side Pagination**
- True server-side pagination (only loads current page data)
- 10 rows per page with full pagination controls
- Efficient data fetching - only requests needed data
- Page navigation with loading indicators

### ✅ **Advanced Row Selection**
- **Individual Selection**: Click checkboxes to select/deselect rows one by one
- **Bulk Selection**: Use the advanced selection panel for bulk operations
- **Header Checkbox**: Select/deselect all rows on current page with tri-state support
- **Persistent Selection**: Selections maintained across page navigation
- **No Limits**: Select unlimited number of rows across all pages

### 🔧 **Selection Controls**
- **Custom Selection Panel**: Advanced dropdown with select/deselect modes
- **Smart Validation**: Prevents invalid operations (e.g., deselecting when nothing is selected)
- **Visual Feedback**: Clear indication of selected rows and counts
- **Keyboard Support**: Enter key support in input fields

## Project Structure

```
src/
├── components/
│   ├── ArtworksTable.tsx          # Main data table component
│   └── RowSelectionPopup.tsx      # Advanced selection panel
├── hooks/
│   └── usePersistentSelection.ts  # Custom hook for selection state
├── services/
│   └── api.ts                     # API service for artwork data
├── App.tsx                        # Main app component
├── main.tsx                       # App entry point
└── index.css                      # Global styles
```

## Technologies Used

- **React 18** with TypeScript
- **PrimeReact** - UI component library
- **PrimeFlex** - CSS utility framework
- **PrimeIcons** - Icon library
- **Art Institute of Chicago API** - Data source

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd artworks-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

### Basic Selection
1. **Individual Rows**: Click the checkbox next to any row to select/deselect it
2. **All Current Page**: Use the header checkbox to select/deselect all rows on the current page
3. **Navigation**: Switch between pages - your selections are preserved

### Advanced Selection
1. Click the **chevron dropdown** (▼) in the table header
2. Choose **Select** or **Deselect** mode
3. Enter the number of rows you want to select/deselect
4. Click the action button to apply

### Selection Features
- **Persistent State**: Your selections remain when navigating between pages
- **Visual Feedback**: Selected row count displayed above the table
- **Smart Controls**: Buttons automatically enable/disable based on current state
- **Validation**: Prevents selecting more rows than available on current page

## API Integration

The application integrates with the Art Institute of Chicago API:

```typescript
// Fetches artwork data with pagination
const response = await fetch(
  `https://api.artic.edu/api/v1/artworks?page=${page}&limit=10&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`
);
```

## Key Components

### ArtworksTable
The main component that handles:
- Data fetching and pagination
- Selection state management
- Table rendering and interactions
- Integration with selection popup

### RowSelectionPopup
Advanced selection panel featuring:
- Select/Deselect mode toggle
- Number input with validation
- Real-time feedback on available operations
- Keyboard navigation support

### usePersistentSelection Hook
Custom hook providing:
- Selection state management
- Bulk operations (select/deselect multiple)
- Persistence across component re-renders
- Utility functions for selection queries

## Styling

The application uses a combination of:
- **PrimeReact themes** - Base component styling
- **PrimeFlex** - Utility classes for layout
- **Custom CSS** - Enhanced styling for specific features

Key style features:
- Responsive design for mobile devices
- Hover effects and visual feedback
- Loading states and transitions
- Consistent color scheme and typography

## Performance Considerations

- **Server-side pagination** - Only loads necessary data
- **Efficient re-renders** - Optimized selection state updates
- **Lazy loading** - Data fetched on demand
- **Memory management** - Proper cleanup of selection state

## Browser Support

- Modern browsers supporting ES2020+
- React 18+ features
- CSS Grid and Flexbox support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Screenshots

### Main Interface
The main table view showing artwork data with selection controls and pagination.

### Selection Panel
The advanced selection dropdown allowing bulk select/deselect operations.

### Persistent Selection
Demonstration of how selections are maintained across page navigation.

---

**Built with ❤️ using React and PrimeReact**
