import React, { memo, useMemo } from 'react';
import { RoomData, CareerRelevance } from '../types';
import { JOB_PROFILES, CATEGORY_COLOR_MAP } from '../constants';
import { ExternalLink, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface RoomCardProps {
  room: RoomData;
  isSelected: boolean;
  selectedJobId: string | null;
  isCompact: boolean;
  onClick: () => void;
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

const getScoreBarColor = (score: number): string => {
  if (score >= 8) return 'bg-emerald-500';
  if (score >= 6) return 'bg-cyan-500';
  if (score >= 4) return 'bg-yellow-500';
  if (score >= 2) return 'bg-orange-500';
  return 'bg-slate-600';
};

export const RoomCard = memo(function RoomCard({ 
  room, 
  isSelected, 
  selectedJobId, 
  isCompact,
  onClick 
}: RoomCardProps) {
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

  const StatusIcon = () => {
    switch (room.status) {
      case 'analyzing':
        return <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />;
      case 'queued':
        return <Clock className="w-3 h-3 text-yellow-400" />;
      case 'complete':
        return <CheckCircle className="w-3 h-3 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      default:
        return null;
    }
  };

  const padding = isCompact ? 'p-2' : 'p-3';
  const gap = isCompact ? 'gap-1' : 'gap-2';

  return (
    <div
      onClick={onClick}
      className={`
        bg-card border rounded cursor-pointer card-hover
        ${isSelected ? 'border-primary/50 ring-1 ring-primary/30' : 'border-border'}
        ${padding}
      `}
    >
      {/* Header */}
      <div className={`flex items-start justify-between ${gap}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <StatusIcon />
            <h3 className={`font-mono font-medium truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {room.name}
            </h3>
          </div>
          
          {room.metadata && (
            <p className={`text-muted-foreground truncate mt-0.5 ${isCompact ? 'text-2xs' : 'text-xs'}`}>
              {room.metadata.summary}
            </p>
          )}
        </div>

        {room.status === 'complete' && (
          <div className={`flex-shrink-0 font-mono font-bold ${getScoreColor(displayScore)} ${isCompact ? 'text-sm' : 'text-base'}`}>
            {displayScore.toFixed(1)}
          </div>
        )}
      </div>

      {/* Score bar */}
      {room.status === 'complete' && (
        <div className="score-bar mt-1.5">
          <div 
            className={`score-fill ${getScoreBarColor(displayScore)}`}
            style={{ width: `${displayScore * 10}%` }}
          />
        </div>
      )}

      {/* Tags row */}
      {room.metadata && (
        <div className={`flex items-center gap-1 mt-1.5 flex-wrap ${isCompact ? 'max-h-5 overflow-hidden' : ''}`}>
          <span className={`chip chip-${categoryColor} ${isCompact ? 'text-2xs px-1 py-0' : ''}`}>
            {room.metadata.mainCategory}
          </span>
          <span className={`chip ${getDifficultyClass(room.metadata.difficulty)} ${isCompact ? 'text-2xs px-1 py-0' : ''}`}>
            {room.metadata.difficulty}
          </span>
          {room.metadata.timeEstimate && (
            <span className={`chip chip-slate ${isCompact ? 'text-2xs px-1 py-0' : ''}`}>
              {room.metadata.timeEstimate}
            </span>
          )}
        </div>
      )}

      {/* Job scores mini grid - only in non-compact */}
      {!isCompact && room.analysis && !selectedJobId && (
        <div className="grid grid-cols-5 gap-1 mt-2">
          {room.analysis.map((a) => {
            const profile = JOB_PROFILES.find(p => p.id === a.jobId);
            return (
              <div key={a.jobId} className="text-center">
                <div className={`text-2xs font-mono ${getScoreColor(a.score)}`}>
                  {a.score}
                </div>
                <div className="text-2xs text-muted-foreground truncate">
                  {profile?.title.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default RoomCard;
