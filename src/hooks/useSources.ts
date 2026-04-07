import { useCallback, useState } from 'react';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';

export const useSources = () => {
  const { currentNotebook, setLoading } = useStore();
  const [sources, setSources] = useState<any[]>([]);

  // Since the API spec didn't explicitly show a separate 'Source' model, 
  // and in NotebookLM sources are often just PDFs/Docs, I'll assume 
  // they are managed under the notebook or as special notes for now.
  // Based on common patterns, I'll mock the fetch for now or use /notebook/{id} if it contains sources.

  const fetchSources = useCallback(async () => {
    if (!currentNotebook) return;
    const uid = currentNotebook.uid || currentNotebook.notebook_uid;
    if (!uid) return;

    setLoading(true);
    try {
      // For now, let's assume sources are returned within notebook details
      const response = await api.get(`/notebook/${uid}`);
      setSources(response.data.sources || []);
    } catch (error) {
      console.error('Error fetching sources:', error);
    } finally {
      setLoading(false);
    }
  }, [currentNotebook, setLoading]);

  return { sources, fetchSources };
};
