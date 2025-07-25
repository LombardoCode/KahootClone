import axios from "axios";

const useUnsplashSearch = () => {
  const API_URL = "https://api.unsplash.com/search/photos";
  const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY!;

  const search = async (query: string, delayMs = 1000, perPage = 30): Promise<any[]> => {
    if (!query.trim()) {
      return [];
    }

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`
        },
        params: {
          query,
          per_page: perPage
        }
      })

      return response.data.results;
    } catch (err) {
      console.error(`Error fetching images from Unsplash: `, err);
      return [];
    }
  }

  return { search };
}

export default useUnsplashSearch;
