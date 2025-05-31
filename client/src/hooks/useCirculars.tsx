import { useState, useEffect } from 'react';
import { Circular } from '../types';
import api from '../utils/api';

// useCirculars hook: fetches circulars from the API and manages selected circular
export const useCirculars = () => {
  const [circulars, setCirculars] = useState<Circular[]>([]);
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null);

  // Fetch circulars on mount
  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        const { data } = await api.get('/circulars');
        setCirculars(data);
      } catch (error) {
        setCirculars([]);
      }
    };
    fetchCirculars();
  }, []);

  // Add a new circular
  const addCircular = async (circular: Omit<Circular, 'id' | 'postedAt'>) => {
    try {
      const { data } = await api.post('/circulars', circular);
      setCirculars(prev => [data, ...prev]);
    } catch (error) {
      // Optionally handle error
    }
  };

  return {
    circulars,
    selectedCircular,
    selectCircular: setSelectedCircular,
    addCircular,
  };
};