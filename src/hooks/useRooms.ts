import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { RoomData, FilterState, SortKey, SortDir, CareerRelevance } from '../types';
import { ROOM_LIST, STORAGE_KEY, DIFFICULTY_ORDER, JOB_PROFILES } from '../constants';
import { analyzeRoom, initializeGemini, isGeminiInitialized } from '../services/geminiService';

const DEBOUNCE_MS = 1000;
const BATCH_CONCURRENCY = 5;

// Initialize rooms from localStorage or defaults
const loadRooms = (): RoomData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as RoomData[];
      // Merge with ROOM_LIST to include any new rooms
      const existingIds = new Set(parsed.map(r => r.id));
      const newRooms = ROOM_LIST
        .filter(id => !existingIds.has(id))
        .map(id => ({ id, name: id, status: 'idle' as const }));
      return [...parsed, ...newRooms];
    }
  } catch (e) {
    console.error('Failed to load rooms from localStorage:', e);
  }
  return ROOM_LIST.map(id => ({ id, name: id, status: 'idle' as const }));
};

// Get API key from sessionStorage
const getApiKey = (): string => sessionStorage.getItem('gemini_api_key') || '';

export const useRooms = () => {
  const [rooms, setRooms] = useState<RoomData[]>(loadRooms);
  const [apiKey, setApiKeyState] = useState(getApiKey);
  const [batchRunning, setBatchRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced save to localStorage
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    }, DEBOUNCE_MS);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [rooms]);

  // Initialize Gemini when API key changes
  const setApiKey = useCallback((key: string) => {
    sessionStorage.setItem('gemini_api_key', key);
    setApiKeyState(key);
    if (key) initializeGemini(key);
  }, []);

  // Initialize on mount if key exists
  useEffect(() => {
    if (apiKey && !isGeminiInitialized()) {
      initializeGemini(apiKey);
    }
  }, [apiKey]);

  // Analyze a single room
  const analyzeRoomById = useCallback(async (roomId: string, signal?: AbortSignal) => {
    if (!isGeminiInitialized()) throw new Error('API key not set');
    
    setRooms(prev => prev.map(r => 
      r.id === roomId ? { ...r, status: 'analyzing' } : r
    ));

    try {
      const result = await analyzeRoom(roomId, signal);
      setRooms(prev => prev.map(r => 
        r.id === roomId ? {
          ...r,
          status: 'complete',
          metadata: result.metadata,
          analysis: result.analysis,
          url: `https://tryhackme.com/room/${roomId}`,
        } : r
      ));
      return true;
    } catch (error: any) {
      if (error.message === 'Aborted') {
        setRooms(prev => prev.map(r => 
          r.id === roomId && r.status === 'analyzing' ? { ...r, status: 'idle' } : r
        ));
      } else {
        setRooms(prev => prev.map(r => 
          r.id === roomId ? { ...r, status: 'error' } : r
        ));
      }
      return false;
    }
  }, []);

  // Batch analyze rooms with concurrency
  const batchAnalyze = useCallback(async (roomIds: string[]) => {
    if (batchRunning || !isGeminiInitialized()) return;
    
    abortRef.current = new AbortController();
    setBatchRunning(true);

    // Mark all as queued
    setRooms(prev => prev.map(r => 
      roomIds.includes(r.id) && (r.status === 'idle' || r.status === 'error')
        ? { ...r, status: 'queued' }
        : r
    ));

    const queue = [...roomIds];
    const active = new Set<string>();

    const processNext = async (): Promise<void> => {
      if (abortRef.current?.signal.aborted) return;
      
      while (queue.length > 0 && active.size < BATCH_CONCURRENCY) {
        const roomId = queue.shift();
        if (!roomId) break;
        
        active.add(roomId);
        analyzeRoomById(roomId, abortRef.current?.signal).finally(() => {
          active.delete(roomId);
          if (!abortRef.current?.signal.aborted) {
            processNext();
          }
        });
      }
    };

    // Start initial batch
    const initialPromises = [];
    for (let i = 0; i < Math.min(BATCH_CONCURRENCY, queue.length); i++) {
      initialPromises.push(processNext());
    }

    // Wait for all to complete or abort
    await Promise.all(initialPromises);

    // Wait for any remaining active
    while (active.size > 0 && !abortRef.current?.signal.aborted) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setBatchRunning(false);
    
    // Reset queued rooms back to idle if aborted
    if (abortRef.current?.signal.aborted) {
      setRooms(prev => prev.map(r => 
        r.status === 'queued' ? { ...r, status: 'idle' } : r
      ));
    }
  }, [batchRunning, analyzeRoomById]);

  const stopBatch = useCallback(() => {
    abortRef.current?.abort();
    setBatchRunning(false);
  }, []);

  // Import rooms from JSON
  const importRooms = useCallback((data: RoomData[]) => {
    const existingIds = new Set(ROOM_LIST);
    const validRooms = data.filter(r => existingIds.has(r.id));
    
    setRooms(prev => {
      const merged = [...prev];
      for (const imported of validRooms) {
        const idx = merged.findIndex(r => r.id === imported.id);
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], ...imported };
        }
      }
      return merged;
    });
  }, []);

  // Export rooms to JSON
  const exportRooms = useCallback(() => {
    return rooms.filter(r => r.status === 'complete');
  }, [rooms]);

  // Reset a room
  const resetRoom = useCallback((roomId: string) => {
    setRooms(prev => prev.map(r => 
      r.id === roomId ? { id: r.id, name: r.name, status: 'idle' } : r
    ));
  }, []);

  // Reset all rooms
  const resetAllRooms = useCallback(() => {
    setRooms(ROOM_LIST.map(id => ({ id, name: id, status: 'idle' })));
  }, []);

  return {
    rooms,
    setRooms,
    apiKey,
    setApiKey,
    analyzeRoomById,
    batchAnalyze,
    stopBatch,
    batchRunning,
    importRooms,
    exportRooms,
    resetRoom,
    resetAllRooms,
  };
};

// Precomputed indexes for tags/tools
export const useRoomIndexes = (rooms: RoomData[]) => {
  return useMemo(() => {
    const tagCounts = new Map<string, number>();
    const toolCounts = new Map<string, number>();
    const categoryCounts = new Map<string, number>();
    const difficultyCounts = new Map<string, number>();

    for (const room of rooms) {
      if (room.metadata) {
        // Tags
        for (const tag of room.metadata.tags) {
          const lower = tag.toLowerCase();
          tagCounts.set(lower, (tagCounts.get(lower) || 0) + 1);
        }
        // Tools
        for (const tool of room.metadata.tools) {
          const lower = tool.toLowerCase();
          toolCounts.set(lower, (toolCounts.get(lower) || 0) + 1);
        }
        // Category
        const cat = room.metadata.mainCategory?.toLowerCase() || 'other';
        categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
        // Difficulty
        const diff = room.metadata.difficulty?.toLowerCase() || 'unknown';
        difficultyCounts.set(diff, (difficultyCounts.get(diff) || 0) + 1);
      }
    }

    return { tagCounts, toolCounts, categoryCounts, difficultyCounts };
  }, [rooms]);
};

// Filter and sort rooms
export const useFilteredRooms = (
  rooms: RoomData[],
  filters: FilterState,
  sortKey: SortKey,
  sortDir: SortDir,
  selectedJobId: string | null
) => {
  return useMemo(() => {
    let filtered = [...rooms];

    // Status filter
    if (filters.statusFilter === 'analyzed') {
      filtered = filtered.filter(r => r.status === 'complete');
    } else if (filters.statusFilter === 'pending') {
      filtered = filtered.filter(r => r.status !== 'complete');
    }

    // Search with regex, AND (&), and negation (!)
    if (filters.search.trim()) {
      const terms = filters.search.split('&').map(t => t.trim()).filter(Boolean);
      filtered = filtered.filter(room => {
        const searchable = [
          room.name,
          room.metadata?.summary || '',
          room.metadata?.description || '',
          room.metadata?.mainCategory || '',
          ...(room.metadata?.tags || []),
          ...(room.metadata?.tools || []),
        ].join(' ').toLowerCase();

        return terms.every(term => {
          const negate = term.startsWith('!');
          const pattern = negate ? term.slice(1) : term;
          if (!pattern) return true;
          
          try {
            const regex = new RegExp(pattern, 'i');
            const matches = regex.test(searchable);
            return negate ? !matches : matches;
          } catch {
            const matches = searchable.includes(pattern.toLowerCase());
            return negate ? !matches : matches;
          }
        });
      });
    }

    // Difficulty filter
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter(r => 
        filters.difficulties.includes(r.metadata?.difficulty?.toLowerCase() || '')
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(r => {
        const cat = r.metadata?.mainCategory?.toLowerCase() || '';
        return filters.categories.some(c => cat.includes(c));
      });
    }

    // Include tags
    if (filters.includeTags.length > 0) {
      filtered = filtered.filter(r => {
        const roomTags = (r.metadata?.tags || []).map(t => t.toLowerCase());
        return filters.includeTags.every(t => roomTags.includes(t.toLowerCase()));
      });
    }

    // Exclude tags
    if (filters.excludeTags.length > 0) {
      filtered = filtered.filter(r => {
        const roomTags = (r.metadata?.tags || []).map(t => t.toLowerCase());
        return !filters.excludeTags.some(t => roomTags.includes(t.toLowerCase()));
      });
    }

    // Include tools
    if (filters.includeTools.length > 0) {
      filtered = filtered.filter(r => {
        const roomTools = (r.metadata?.tools || []).map(t => t.toLowerCase());
        return filters.includeTools.every(t => roomTools.includes(t.toLowerCase()));
      });
    }

    // Exclude tools
    if (filters.excludeTools.length > 0) {
      filtered = filtered.filter(r => {
        const roomTools = (r.metadata?.tools || []).map(t => t.toLowerCase());
        return !filters.excludeTools.some(t => roomTools.includes(t.toLowerCase()));
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let cmp = 0;
      
      switch (sortKey) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'difficulty':
          const diffA = DIFFICULTY_ORDER[a.metadata?.difficulty?.toLowerCase() || 'unknown'] ?? 99;
          const diffB = DIFFICULTY_ORDER[b.metadata?.difficulty?.toLowerCase() || 'unknown'] ?? 99;
          cmp = diffA - diffB;
          break;
        case 'score':
          const getScore = (r: RoomData) => {
            if (!r.analysis) return -1;
            if (selectedJobId) {
              return r.analysis.find(a => a.jobId === selectedJobId)?.score ?? 0;
            }
            return r.analysis.reduce((sum, a) => sum + a.score, 0) / r.analysis.length;
          };
          cmp = getScore(b) - getScore(a);
          break;
      }

      return sortDir === 'asc' ? cmp : -cmp;
    });

    return filtered;
  }, [rooms, filters, sortKey, sortDir, selectedJobId]);
};
