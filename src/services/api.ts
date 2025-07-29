interface ArtworkApiResponse {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface ApiResponse {
  data: ArtworkApiResponse[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
}

export const fetchArtworks = async (page: number): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks?page=${page}&limit=10&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};