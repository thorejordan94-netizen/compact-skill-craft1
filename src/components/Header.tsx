import React, { memo, useCallback, useState } from 'react';
import { ViewMode, SortKey, SortDir } from '../types';
import { JOB_PROFILES } from '../constants';
import { 
  Search, Grid, List, ArrowUpDown, ArrowUp, ArrowDown, 
  Play, Square, Download, Upload, Settings, Key, 
  Cloud, CloudOff, Menu, Maximize2, Minimize2 
} from 'lucide-react';

interface HeaderProps {
  search: string;
  setSearch: (value: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
  sortDir: SortDir;
  setSortDir: (dir: SortDir) => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  isCompact: boolean;
  setIsCompact: (compact: boolean) => void;
  batchRunning: boolean;
  onBatchAnalyze: () => void;
  onStopBatch: () => void;
  onImport: () => void;
  onExport: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  filteredCount: number;
  totalCount: number;
  analyzedCount: number;
}

export const Header = memo(function Header({
  search,
  setSearch,
  viewMode,
  setViewMode,
  sortKey,
  setSortKey,
  sortDir,
  setSortDir,
  selectedJobId,
  setSelectedJobId,
  isCompact,
  setIsCompact,
  batchRunning,
  onBatchAnalyze,
  onStopBatch,
  onImport,
  onExport,
  onOpenSettings,
  onToggleSidebar,
  filteredCount,
  totalCount,
  analyzedCount,
}: HeaderProps) {
  const toggleSort = useCallback((key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'score' ? 'desc' : 'asc');
    }
  }, [sortKey, sortDir, setSortKey, setSortDir]);

  const SortIcon = sortDir === 'asc' ? ArrowUp : ArrowDown;
  const btnClass = 'p-1.5 rounded hover:bg-muted transition-colors';
  const btnActiveClass = 'bg-primary/20 text-primary';

  return (
    <header className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 p-2">
        {/* Sidebar toggle */}
        <button onClick={onToggleSidebar} className={btnClass} title="Toggle filters">
          <Menu className="w-4 h-4" />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search (regex, & for AND, ! to negate)..."
            className="input-compact w-full pl-7 pr-2"
          />
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span>{filteredCount}/{totalCount}</span>
          <span className="text-emerald-400">{analyzedCount} analyzed</span>
        </div>

        {/* Job filter */}
        <select
          value={selectedJobId || ''}
          onChange={(e) => setSelectedJobId(e.target.value || null)}
          className="input-compact w-24 sm:w-28"
        >
          <option value="">All Jobs</option>
          {JOB_PROFILES.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>

        {/* Sort */}
        <div className="hidden md:flex items-center gap-1">
          {(['score', 'name', 'difficulty'] as SortKey[]).map(key => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={`${btnClass} text-xs flex items-center gap-0.5 ${sortKey === key ? btnActiveClass : ''}`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
              {sortKey === key && <SortIcon className="w-3 h-3" />}
            </button>
          ))}
        </div>

        {/* View mode */}
        <div className="flex items-center border border-border rounded overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            title="Grid view"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            title="List view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Density toggle */}
        <button
          onClick={() => setIsCompact(!isCompact)}
          className={btnClass}
          title={isCompact ? 'Comfortable' : 'Compact'}
        >
          {isCompact ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </button>

        {/* Batch analyze */}
        {batchRunning ? (
          <button
            onClick={onStopBatch}
            className="flex items-center gap-1 px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs font-medium hover:bg-destructive/90 transition-colors"
          >
            <Square className="w-3 h-3" />
            Stop
          </button>
        ) : (
          <button
            onClick={onBatchAnalyze}
            className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors btn-glow"
          >
            <Play className="w-3 h-3" />
            Analyze
          </button>
        )}

        {/* Import/Export */}
        <button onClick={onImport} className={btnClass} title="Import JSON">
          <Upload className="w-4 h-4" />
        </button>
        <button onClick={onExport} className={btnClass} title="Export JSON">
          <Download className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button onClick={onOpenSettings} className={btnClass} title="Settings">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
});

export default Header;
