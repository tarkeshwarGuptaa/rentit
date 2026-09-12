import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const useRooms = (initialFilters = {}) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 12,
  });
  const [filters, setFilters] = useState(initialFilters);

  const fetchRooms = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = { ...filters, ...params };

      // Remove empty values
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === '' || queryParams[key] === undefined || queryParams[key] === null) {
          delete queryParams[key];
        }
      });

      const { data } = await api.get('/rooms', { params: queryParams });
      setRooms(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const changePage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const refetch = useCallback(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    refetch,
  };
};

export default useRooms;
