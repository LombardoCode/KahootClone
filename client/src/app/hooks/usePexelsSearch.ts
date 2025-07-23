import axios from "axios";
import { useEffect, useState } from "react";
var debounce = require('lodash.debounce');

const usePexelsSearch = (query: string, delay: number = 1000, perPage: number = 12) => {
  const API_URL = "https://api.pexels.com/v1/search";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY!;

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchImages = debounce(() => {
      try {
        setLoading(true);

        axios.get(API_URL, {
          headers: {
            Authorization: API_KEY
          },
          params: {
            query,
            per_page: perPage
          }
        })
        .then(res => {
          setResults(res.data.photos);
        })
        .catch(err => {
          console.error(`Error fetching images from Pexels: `, err);
        })
      } catch (err) {
        console.error(`Error fetching images from Pexels: `, err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay)

    fetchImages();

    return () => {
      fetchImages.cancel();
    }
  }, [query, delay, perPage]);

  return { results, loading };
}

export default usePexelsSearch;
