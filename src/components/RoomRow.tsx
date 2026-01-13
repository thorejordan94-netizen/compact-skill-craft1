import React, { memo, useMemo } from 'react';
import { RoomData } from '../types';
import { JOB_PROFILES, CATEGORY_COLOR_MAP } from '../constants';
import { ExternalLink, AlertCircle, CheckCircle, Clock, Loader2, ChevronRight } from 'lucide-react';

interface RoomRowProps {
  room: RoomData;
  isSelected: boolean;
  isExpanded: boolean;
  selectedJobId: string | null;
  isCompact: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

const getDifficultyClass = (difficulty: string): string => {
  const d = difficulty?.toLowerCase() || '';
  if (d === 'info') return 'diff-info';
  if (d === 'easy') return 'diff-easy';
  if (d === 'medium') return 'diff-medium';
  if (d === 'hard') return 'diff-hard';
  if (d === 'insane') return 'diff-insane';
  return 'chip-slate';
};

const getCategoryColor = (category: string): string => {
  const lower = category?.toLowerCase() || '';
  for (const [key, color] of Object.entries(CATEGORY_COLOR_MAP)) {
    if (lower.includes(key)) return color;
  }
  return 'slate';
};

const getScoreColor = (score: number): string => {
  if (score >= 8) return 'text-emerald-400';
  if (score >= 6) return 'text-cyan-400';
  if (score >= 4) return 'text-yellow-400';
  if (score >= 2) return 'text-orange-400';
  return 'text-slate-500';
};

export const RoomRow = memo(function RoomRow({ 
  room, 
  isSelected, 
  isExpanded,
  selectedJobId, 
  isCompact,
  onClick,
  style
}: RoomRowProps) {
  const { avgScore, jobScore } = useMemo(() => {
    if (!room.analysis) return { avgScore: 0, jobScore: null };
    
    const avg = room.analysis.reduce((sum, a) => sum + a.score, 0) / room.analysis.length;
    const job = selectedJobId 
      ? room.analysis.find(a => a.jobId === selectedJobId)?.score ?? 0 
      : null;
    
    return { avgScore: avg, jobScore: job };
  }, [room.analysis, selectedJobId]);

  const displayScore = jobScore ?? avgScore;
  const categoryColor = getCategoryColor(room.metadata?.mainCategory || '');
  const height = isCompact ? 'h-8' : 'h-10';

  const StatusIcon = () => {
    switch (room.status) {
      case 'analyzing':
        return <Loader2 className="w-3 h-3 animate-spin text-cyan-400 flex-shrink-0" />;
      case 'queued':
        return <Clock className="w-3 h-3 text-yellow-400 flex-shrink-0" />;
      case 'complete':
        return <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-muted flex-shrink-0" />;
    }
  };

  return (
    <div
      onClick={onClick}
      style={style}
      className={`
        flex items-center gap-2 px-2 border-b border-border cursor-pointer
        hover:bg-card/60 transition-colors
        ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : ''}
        ${height}
      `}
    >
      {/* Expand indicator */}
      <ChevronRight 
        className={`w-3 h-3 text-muted-foreground transition-transform flex-shrink-0 ${
          isExpanded ? 'rotate-90' : ''
        }`} 
      />
      
      {/* Status */}
      <StatusIcon />

      {/* Name */}
      <span className={`font-mono truncate flex-1 min-w-0 ${isCompact ? 'text-xs' : 'text-sm'}`}>
        {room.name}
      </span>

      {/* Category */}
      {room.metadata && (
        <span className={`chip chip-${categoryColor} flex-shrink-0 ${isCompact ? 'text-2xs px-1 py-0' : 'text-xs'}`}>
          {room.metadata.mainCategory}
        </span>
      )}

      {/* Difficulty */}
      {room.metadata && (
        <span className={`chip flex-shrink-0 ${getDifficultyClass(room.metadata.difficulty)} ${isCompact ? 'text-2xs px-1 py-0 w-12 text-center' : 'text-xs w-14 text-center'}`}>
          {room.metadata.difficulty}
        </span>
      )}

      {/* Time */}
      {room.metadata?.timeEstimate && (
        <span className={`text-muted-foreground flex-shrink-0 ${isCompact ? 'text-2xs w-10' : 'text-xs w-12'} text-right`}>
          {room.metadata.timeEstimate}
        </span>
      )}

      {/* Job scores */}
      {room.analysis && (
        <div className={`flex gap-1 flex-shrink-0 ${isCompact ? 'gap-0.5' : ''}`}>
          {room.analysis.map((a) => (
            <span 
              key={a.jobId} 
              className={`font-mono font-medium ${getScoreColor(a.score)} ${isCompact ? 'text-2xs w-4' : 'text-xs w-5'} text-center ${
                selectedJobId === a.jobId ? 'ring-1 ring-primary rounded px-0.5' : ''
              }`}
            >
              {a.score}
            </span>
          ))}
        </div>
      )}

      {/* Avg/Total score */}
      {room.status === 'complete' && (
        <span className={`font-mono font-bold ${getScoreColor(displayScore)} flex-shrink-0 ${isCompact ? 'text-xs w-8' : 'text-sm w-10'} text-right`}>
          {displayScore.toFixed(1)}
        </span>
      )}
    </div>
  );
});

export default RoomRow;
