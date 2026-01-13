import React, { memo, useMemo, useCallback } from 'react';
import { FilterState } from '../types';
import { CLUSTERS, DIFFICULTY_ORDER } from '../constants';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  tagCounts: Map<string, number>;
  toolCounts: Map<string, number>;
  categoryCounts: Map<string, number>;
  difficultyCounts: Map<string, number>;
  isCompact: boolean;
  onClose?: () => void;
}

const DIFFICULTIES = ['info', 'easy', 'medium', 'hard', 'insane'];

export const FilterSidebar = memo(function FilterSidebar({
  filters,
  setFilters,
  tagCounts,
  toolCounts,
  categoryCounts,
  difficultyCounts,
  isCompact,
  onClose,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState({
    status: true,
    difficulty: true,
    category: true,
    tags: false,
    tools: false,
  });

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // Sort tags/tools by count
  const sortedTags = useMemo(() => 
    Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
  , [tagCounts]);

  const sortedTools = useMemo(() => 
    Array.from(toolCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
  , [toolCounts]);

  const handleTagClick = useCallback((tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    const lower = tag.toLowerCase();
    
    if (e.button === 2 || e.ctrlKey || e.metaKey) {
      // Right click or ctrl+click = exclude
      setFilters(prev => {
        const newExclude = prev.excludeTags.includes(lower)
          ? prev.excludeTags.filter(t => t !== lower)
          : [...prev.excludeTags, lower];
        return { ...prev, excludeTags: newExclude, includeTags: prev.includeTags.filter(t => t !== lower) };
      });
    } else {
      // Left click = include
      setFilters(prev => {
        const newInclude = prev.includeTags.includes(lower)
          ? prev.includeTags.filter(t => t !== lower)
          : [...prev.includeTags, lower];
        return { ...prev, includeTags: newInclude, excludeTags: prev.excludeTags.filter(t => t !== lower) };
      });
    }
  }, [setFilters]);

  const handleToolClick = useCallback((tool: string, e: React.MouseEvent) => {
    e.preventDefault();
    const lower = tool.toLowerCase();
    
    if (e.button === 2 || e.ctrlKey || e.metaKey) {
      setFilters(prev => {
        const newExclude = prev.excludeTools.includes(lower)
          ? prev.excludeTools.filter(t => t !== lower)
          : [...prev.excludeTools, lower];
        return { ...prev, excludeTools: newExclude, includeTools: prev.includeTools.filter(t => t !== lower) };
      });
    } else {
      setFilters(prev => {
        const newInclude = prev.includeTools.includes(lower)
          ? prev.includeTools.filter(t => t !== lower)
          : [...prev.includeTools, lower];
        return { ...prev, includeTools: newInclude, excludeTools: prev.excludeTools.filter(t => t !== lower) };
      });
    }
  }, [setFilters]);

  const handleDifficultyClick = useCallback((diff: string) => {
    setFilters(prev => {
      const newDiffs = prev.difficulties.includes(diff)
        ? prev.difficulties.filter(d => d !== diff)
        : [...prev.difficulties, diff];
      return { ...prev, difficulties: newDiffs };
    });
  }, [setFilters]);

  const handleCategoryClick = useCallback((cat: string) => {
    setFilters(prev => {
      const newCats = prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: newCats };
    });
  }, [setFilters]);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      difficulties: [],
      categories: [],
      includeTags: [],
      excludeTags: [],
      includeTools: [],
      excludeTools: [],
      statusFilter: 'all',
    });
  }, [setFilters]);

  const hasActiveFilters = 
    filters.difficulties.length > 0 ||
    filters.categories.length > 0 ||
    filters.includeTags.length > 0 ||
    filters.excludeTags.length > 0 ||
    filters.includeTools.length > 0 ||
    filters.excludeTools.length > 0 ||
    filters.statusFilter !== 'all';

  const padding = isCompact ? 'p-2' : 'p-3';
  const gap = isCompact ? 'gap-2' : 'gap-3';
  const textSize = isCompact ? 'text-xs' : 'text-sm';

  const SectionHeader = ({ title, section, count }: { title: string; section: keyof typeof expandedSections; count?: number }) => (
    <button
      onClick={() => toggleSection(section)}
      className={`flex items-center justify-between w-full ${textSize} font-medium hover:text-primary transition-colors`}
    >
      <span className="flex items-center gap-1">
        {title}
        {count !== undefined && <span className="text-muted-foreground">({count})</span>}
      </span>
      {expandedSections[section] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
    </button>
  );

  return (
    <div className={`h-full flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${padding} border-b border-sidebar-border`}>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className={`font-medium ${textSize}`}>Filters</span>
        </div>
        <div className="flex items-center gap-1">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-2xs text-muted-foreground hover:text-foreground transition-colors px-1"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-sidebar-accent rounded">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${padding} ${gap} flex flex-col`}>
        {/* Status filter */}
        <div>
          <SectionHeader title="Status" section="status" />
          {expandedSections.status && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {(['all', 'analyzed', 'pending'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilters(prev => ({ ...prev, statusFilter: status }))}
                  className={`chip ${filters.statusFilter === status ? 'chip-cyan' : 'chip-slate'} capitalize`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <SectionHeader title="Difficulty" section="difficulty" />
          {expandedSections.difficulty && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {DIFFICULTIES.map(diff => {
                const count = difficultyCounts.get(diff) || 0;
                const isActive = filters.difficulties.includes(diff);
                return (
                  <button
                    key={diff}
                    onClick={() => handleDifficultyClick(diff)}
                    className={`chip capitalize ${isActive ? `diff-${diff}` : 'chip-slate opacity-60'}`}
                  >
                    {diff} <span className="text-2xs opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <SectionHeader title="Category" section="category" />
          {expandedSections.category && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {Object.entries(CLUSTERS).map(([key, { name, color }]) => {
                const count = categoryCounts.get(key) || categoryCounts.get(name.toLowerCase()) || 0;
                const isActive = filters.categories.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => handleCategoryClick(key)}
                    className={`chip ${isActive ? `chip-${color}` : 'chip-slate opacity-60'}`}
                  >
                    {name} <span className="text-2xs opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Active tag/tool filters */}
        {(filters.includeTags.length > 0 || filters.excludeTags.length > 0) && (
          <div>
            <span className="text-2xs text-muted-foreground">Active tag filters:</span>
            <div className="flex gap-1 mt-1 flex-wrap">
              {filters.includeTags.map(tag => (
                <span key={tag} className="chip chip-cyan text-2xs">
                  +{tag}
                  <button onClick={() => setFilters(prev => ({ ...prev, includeTags: prev.includeTags.filter(t => t !== tag) }))} className="ml-1">×</button>
                </span>
              ))}
              {filters.excludeTags.map(tag => (
                <span key={tag} className="chip chip-orange text-2xs">
                  -{tag}
                  <button onClick={() => setFilters(prev => ({ ...prev, excludeTags: prev.excludeTags.filter(t => t !== tag) }))} className="ml-1">×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {(filters.includeTools.length > 0 || filters.excludeTools.length > 0) && (
          <div>
            <span className="text-2xs text-muted-foreground">Active tool filters:</span>
            <div className="flex gap-1 mt-1 flex-wrap">
              {filters.includeTools.map(tool => (
                <span key={tool} className="chip chip-emerald text-2xs">
                  +{tool}
                  <button onClick={() => setFilters(prev => ({ ...prev, includeTools: prev.includeTools.filter(t => t !== tool) }))} className="ml-1">×</button>
                </span>
              ))}
              {filters.excludeTools.map(tool => (
                <span key={tool} className="chip chip-orange text-2xs">
                  -{tool}
                  <button onClick={() => setFilters(prev => ({ ...prev, excludeTools: prev.excludeTools.filter(t => t !== tool) }))} className="ml-1">×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <SectionHeader title="Tags" section="tags" count={sortedTags.length} />
          {expandedSections.tags && (
            <div className="flex gap-1 mt-1.5 flex-wrap max-h-40 overflow-y-auto">
              {sortedTags.map(([tag, count]) => {
                const isIncluded = filters.includeTags.includes(tag);
                const isExcluded = filters.excludeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={(e) => handleTagClick(tag, e)}
                    onContextMenu={(e) => { e.preventDefault(); handleTagClick(tag, e); }}
                    className={`chip text-2xs ${isIncluded ? 'chip-cyan' : isExcluded ? 'chip-orange' : 'chip-slate opacity-70'}`}
                    title="Left-click to include, Right-click to exclude"
                  >
                    {tag} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tools */}
        <div>
          <SectionHeader title="Tools" section="tools" count={sortedTools.length} />
          {expandedSections.tools && (
            <div className="flex gap-1 mt-1.5 flex-wrap max-h-40 overflow-y-auto">
              {sortedTools.map(([tool, count]) => {
                const isIncluded = filters.includeTools.includes(tool);
                const isExcluded = filters.excludeTools.includes(tool);
                return (
                  <button
                    key={tool}
                    onClick={(e) => handleToolClick(tool, e)}
                    onContextMenu={(e) => { e.preventDefault(); handleToolClick(tool, e); }}
                    className={`chip text-2xs ${isIncluded ? 'chip-emerald' : isExcluded ? 'chip-orange' : 'chip-slate opacity-70'}`}
                    title="Left-click to include, Right-click to exclude"
                  >
                    {tool} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default FilterSidebar;
