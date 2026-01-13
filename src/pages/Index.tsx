import React, { useState, useCallback, useMemo, useRef, Suspense, lazy } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRooms, useRoomIndexes, useFilteredRooms } from '../hooks/useRooms';
import { FilterState, ViewMode, SortKey, SortDir } from '../types';
import { Header } from '../components/Header';
import { FilterSidebar } from '../components/FilterSidebar';
import { RoomCard } from '../components/RoomCard';
import { RoomRow } from '../components/RoomRow';
import { RoomDetail } from '../components/RoomDetail';
import { SettingsModal } from '../components/SettingsModal';

const Index = () => {
  const {
    rooms, apiKey, setApiKey, analyzeRoomById, batchAnalyze, stopBatch, batchRunning,
    importRooms, exportRooms, resetAllRooms,
  } = useRooms();

  const [filters, setFilters] = useState<FilterState>({
    search: '', difficulties: [], categories: [], includeTags: [], excludeTags: [],
    includeTools: [], excludeTools: [], statusFilter: 'all',
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const indexes = useRoomIndexes(rooms);
  const filteredRooms = useFilteredRooms(rooms, filters, sortKey, sortDir, selectedJobId);
  const selectedRoom = useMemo(() => rooms.find(r => r.id === selectedRoomId), [rooms, selectedRoomId]);
  const analyzedCount = useMemo(() => rooms.filter(r => r.status === 'complete').length, [rooms]);

  const parentRef = useRef<HTMLDivElement>(null);
  const rowHeight = isCompact ? 32 : 40;
  const columnCount = viewMode === 'grid' ? Math.max(1, Math.floor((parentRef.current?.clientWidth || 800) / (isCompact ? 220 : 280))) : 1;

  const virtualizer = useVirtualizer({
    count: viewMode === 'list' ? filteredRooms.length : Math.ceil(filteredRooms.length / columnCount),
    getScrollElement: () => parentRef.current,
    estimateSize: () => viewMode === 'list' ? rowHeight : (isCompact ? 100 : 140),
    overscan: 5,
  });

  const handleRoomClick = useCallback((roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    if (room.status === 'idle' || room.status === 'error') {
      analyzeRoomById(roomId);
    } else {
      setSelectedRoomId(prev => prev === roomId ? null : roomId);
    }
  }, [rooms, analyzeRoomById]);

  const handleBatchAnalyze = useCallback(() => {
    const pending = filteredRooms.filter(r => r.status === 'idle' || r.status === 'error').map(r => r.id);
    if (pending.length > 0) batchAnalyze(pending);
  }, [filteredRooms, batchAnalyze]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) { const text = await file.text(); importRooms(JSON.parse(text)); }
    };
    input.click();
  }, [importRooms]);

  const handleExport = useCallback(() => {
    const data = exportRooms();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'thm_career_mapper.json'; a.click();
  }, [exportRooms]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header
        search={filters.search} setSearch={(s) => setFilters(p => ({ ...p, search: s }))}
        viewMode={viewMode} setViewMode={setViewMode}
        sortKey={sortKey} setSortKey={setSortKey} sortDir={sortDir} setSortDir={setSortDir}
        selectedJobId={selectedJobId} setSelectedJobId={setSelectedJobId}
        isCompact={isCompact} setIsCompact={setIsCompact}
        batchRunning={batchRunning} onBatchAnalyze={handleBatchAnalyze} onStopBatch={stopBatch}
        onImport={handleImport} onExport={handleExport} onOpenSettings={() => setSettingsOpen(true)}
        onToggleSidebar={() => setSidebarOpen(p => !p)}
        filteredCount={filteredRooms.length} totalCount={rooms.length} analyzedCount={analyzedCount}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-56' : 'w-0'} flex-shrink-0 transition-all duration-200 overflow-hidden`}>
          <FilterSidebar filters={filters} setFilters={setFilters} isCompact={isCompact}
            tagCounts={indexes.tagCounts} toolCounts={indexes.toolCounts}
            categoryCounts={indexes.categoryCounts} difficultyCounts={indexes.difficultyCounts}
            onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <div ref={parentRef} className="flex-1 overflow-auto">
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {viewMode === 'list' ? (
              virtualizer.getVirtualItems().map((vItem) => {
                const room = filteredRooms[vItem.index];
                return (
                  <RoomRow key={room.id} room={room} isSelected={selectedRoomId === room.id}
                    isExpanded={selectedRoomId === room.id} selectedJobId={selectedJobId}
                    isCompact={isCompact} onClick={() => handleRoomClick(room.id)}
                    style={{ position: 'absolute', top: vItem.start, left: 0, right: 0, height: rowHeight }} />
                );
              })
            ) : (
              virtualizer.getVirtualItems().map((vItem) => {
                const startIdx = vItem.index * columnCount;
                return (
                  <div key={vItem.index} className="grid gap-2 px-2" style={{
                    position: 'absolute', top: vItem.start, left: 0, right: 0,
                    gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                  }}>
                    {Array.from({ length: columnCount }).map((_, colIdx) => {
                      const room = filteredRooms[startIdx + colIdx];
                      if (!room) return <div key={colIdx} />;
                      return (
                        <RoomCard key={room.id} room={room} isSelected={selectedRoomId === room.id}
                          selectedJobId={selectedJobId} isCompact={isCompact}
                          onClick={() => handleRoomClick(room.id)} />
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selectedRoom && selectedRoom.status === 'complete' && (
          <div className="w-80 flex-shrink-0 hidden lg:block animate-slide-in-right">
            <RoomDetail room={selectedRoom} onClose={() => setSelectedRoomId(null)} isCompact={isCompact} />
          </div>
        )}
      </div>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)}
        apiKey={apiKey} setApiKey={setApiKey} rooms={rooms} importRooms={importRooms}
        resetAllRooms={resetAllRooms} isCompact={isCompact} />
    </div>
  );
};

export default Index;
