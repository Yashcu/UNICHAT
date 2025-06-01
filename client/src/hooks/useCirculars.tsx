import { useState, useEffect } from 'react';
import { Circular } from '../types';
import { fetchCirculars, createCircular } from '../utils/api';

// useCirculars hook: fetches circulars from the API and manages selected circular
export const useCirculars = () => {
  const [circulars, setCirculars] = useState<Circular[]>([]);
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch circulars on mount
  useEffect(() => {
    const getCirculars = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('useCirculars - Fetching circulars...');
        const { data } = await fetchCirculars();
        console.log('useCirculars - Circulars data:', data);
        setCirculars(data);
      } catch (err: any) {
        console.error('useCirculars - Error fetching circulars:', err);
        setError(err.message || 'Failed to fetch circulars.');
        setCirculars([]);
      } finally {
        console.log('useCirculars - Fetching complete.');
        setIsLoading(false);
      }
    };
    getCirculars();
  }, []);

  // Add a new circular
  const addCircular = async (circular: Omit<Circular, 'id' | 'postedAt' | 'postedBy'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await createCircular(circular);
      setCirculars(prev => [data, ...prev]);
      setIsLoading(false);
      return data; // Return the created circular
    } catch (err: any) {
      setError(err.message || 'Failed to add circular.');
      setIsLoading(false);
      throw err; // Re-throw to allow components to handle
    }
  };

  return {
    circulars,
    selectedCircular,
    selectCircular: setSelectedCircular,
    addCircular,
    isLoading,
    error,
  };
};
