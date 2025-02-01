import { useState, useEffect } from 'react';

const useCollections = (url) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setCollections(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  const addCollection = (newCollection) => {
    setCollections((prev) => [...prev, newCollection]);
  };

  useEffect(() => {
    fetchCollections();
  }, [url]);

  return { collections, fetchCollections, addCollection, loading, error };
};

export default useCollections;
