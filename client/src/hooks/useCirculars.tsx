import { useState } from 'react'; // Removed useEffect
import { Circular } from '../types';
import { fetchCirculars as fetchCircularsApi, createCircular as addCircularApi } from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define the expected structure for new circular data based on its usage
type NewCircularData = Omit<Circular, 'id' | 'postedAt' | 'postedBy'>;
// Define the expected response structure for API calls if known, e.g. { data: Circular[] } for fetch, { data: Circular } for create
interface FetchCircularsResponse { data: Circular[]; }
interface AddCircularResponse { data: Circular; }


export const useCirculars = () => {
  const queryClient = useQueryClient();
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null);

  // Circulars Fetching
  const { data: circularsData, isLoading: loadingCirculars, error: circularsError } = useQuery<FetchCircularsResponse, Error>({
    queryKey: ['circulars'],
    queryFn: fetchCircularsApi,
  });
  const circulars = circularsData?.data || [];

  // Add Circular Mutation
  const { mutateAsync: addCircularMutate, isLoading: addingCircular, error: addCircularError } = useMutation<AddCircularResponse, Error, NewCircularData>({
    mutationFn: (newCircularData: NewCircularData) => addCircularApi(newCircularData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circulars'] });
    },
  });

  const addCircular = async (data: NewCircularData) => {
    // The component might expect the created circular data or rely on react-query's cache update
    // For simplicity, we call mutateAsync and let react-query handle caching and updates.
    // If the component needs the direct return value, this can be `return await addCircularMutate(data);`
    // and the component would then handle the promise.
    // Or, use `mutate` and handle results/errors via `onSuccess`/`onError` in the mutation definition.
    return addCircularMutate(data);
  };

  return {
    circulars,
    selectedCircular,
    selectCircular: setSelectedCircular,
    addCircular,
    isLoading: loadingCirculars, // Keep isLoading for backward compatibility if components use it generally
    error: circularsError as Error | null, // Cast for consistent error object or null
    loadingCirculars, // More specific loading state
    circularsError: circularsError as Error | null,
    addingCircular,
    addCircularError: addCircularError as Error | null,
  };
};
