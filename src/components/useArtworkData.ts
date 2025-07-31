import { useEffect, useState } from "react";
import { fetchArtworks } from "../services/api";
import { Artwork } from './types';

export const useArtworkData = (page: number, rowsPerPage: number) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allArtworkIds, setAllArtworkIds] = useState<Set<number>>(new Set());
  const [allFetchedArtworks, setAllFetchedArtworks] = useState<Map<number, Artwork>>(new Map());

  // Fetch page data - TRUE server-side pagination
  const loadData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = await fetchArtworks(pageNumber + 1);
      const mapped = data.data.map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled',
        place_of_origin: item.place_of_origin || 'Unknown',
        artist_display: item.artist_display || 'Unknown Artist',
        inscriptions: item.inscriptions || 'None',
        date_start: item.date_start || 0,
        date_end: item.date_end || 0,
      }));
      setArtworks(mapped);
      setTotalRecords(data.pagination.total);
      
      // Track all artwork IDs we've seen
      const newIds = mapped.map(artwork => artwork.id);
      setAllArtworkIds(prev => new Set([...prev, ...newIds]));
      
      // Store all fetched artworks
      const newArtworksMap = new Map(allFetchedArtworks);
      mapped.forEach(artwork => {
        newArtworksMap.set(artwork.id, artwork);
      });
      setAllFetchedArtworks(newArtworksMap);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch multiple pages for cross-page selection
  const fetchArtworksForSelection = async (startPage: number, count: number): Promise<Artwork[]> => {
    const artworksToSelect: Artwork[] = [];
    let currentPage = startPage;
    let remainingCount = count;
    
    while (remainingCount > 0 && currentPage <= Math.ceil(totalRecords / rowsPerPage)) {
      try {
        const data = await fetchArtworks(currentPage);
        const mapped = data.data.map((item: any) => ({
          id: item.id,
          title: item.title || 'Untitled',
          place_of_origin: item.place_of_origin || 'Unknown',
          artist_display: item.artist_display || 'Unknown Artist',
          inscriptions: item.inscriptions || 'None',
          date_start: item.date_start || 0,
          date_end: item.date_end || 0,
        }));
        
        const artworksToTake = mapped.slice(0, remainingCount);
        artworksToSelect.push(...artworksToTake);
        remainingCount -= artworksToTake.length;
        currentPage++;
        
        // Update our stored artworks
        const newArtworksMap = new Map(allFetchedArtworks);
        mapped.forEach(artwork => {
          newArtworksMap.set(artwork.id, artwork);
        });
        setAllFetchedArtworks(newArtworksMap);
        
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error);
        break;
      }
    }
    
    return artworksToSelect;
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  return {
    artworks,
    totalRecords,
    loading,
    allArtworkIds,
    allFetchedArtworks,
    loadData,
    fetchArtworksForSelection
  };
};