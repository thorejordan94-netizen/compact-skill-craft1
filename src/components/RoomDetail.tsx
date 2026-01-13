import React, { memo } from 'react';
import { RoomData } from '../types';
import { JOB_PROFILES, CATEGORY_COLOR_MAP } from '../constants';
import { X, ExternalLink, Clock, Tag, Wrench, Target } from 'lucide-react';

interface RoomDetailProps {
  room: RoomData;
  onClose: () => void;
  isCompact: boolean;
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

export const RoomDetail = memo(function RoomDetail({ room, onClose, isCompact }: RoomDetailProps) {
  const { metadata, analysis } = room;
  const padding = isCompact ? 'p-2' : 'p-3';
  const gap = isCompact ? 'gap-2' : 'gap-3';
  const categoryColor = getCategoryColor(metadata?.mainCategory || '');

  // Parse key takeaways into bullets
  const takeaways = metadata?.keyTakeaways
    ?.split('\n')
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean) || [];

  return (
    <div className={`h-full flex flex-col bg-card border-l border-border overflow-hidden`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${padding} border-b border-border`}>
        <div className="flex items-center gap-2 min-w-0">
          <h2 className={`font-mono font-bold truncate ${isCompact ? 'text-sm' : 'text-base'}`}>
            {room.name}
          </h2>
          <a 
            href={`https://tryhackme.com/room/${room.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${padding} ${gap} flex flex-col`}>
        {!metadata ? (
          <div className="text-muted-foreground text-sm">Nicht analysiert</div>
        ) : (
          <>
            {/* Meta badges */}
            <div className="flex flex-wrap gap-1">
              <span className={`chip chip-${categoryColor}`}>{metadata.mainCategory}</span>
              <span className={`chip ${getDifficultyClass(metadata.difficulty)}`}>{metadata.difficulty}</span>
              {metadata.environment && (
                <span className="chip chip-slate">{metadata.environment}</span>
              )}
              {metadata.type && (
                <span className="chip chip-slate">{metadata.type}</span>
              )}
              {metadata.timeEstimate && (
                <span className="chip chip-slate flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {metadata.timeEstimate}
                </span>
              )}
            </div>

            {/* Summary */}
            {metadata.summary && (
              <p className={`text-foreground ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {metadata.summary}
              </p>
            )}

            {/* Description */}
            {metadata.description && (
              <p className={`text-muted-foreground ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {metadata.description}
              </p>
            )}

            {/* Key Takeaways */}
            {takeaways.length > 0 && (
              <div>
                <h4 className={`font-medium mb-1 flex items-center gap-1 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  <Target className="w-3 h-3 text-primary" />
                  Key Takeaways
                </h4>
                <ul className={`space-y-0.5 ${isCompact ? 'text-2xs' : 'text-xs'} text-muted-foreground`}>
                  {takeaways.map((t, i) => (
                    <li key={i} className="flex gap-1">
                      <span className="text-primary">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {metadata.tags.length > 0 && (
              <div>
                <h4 className={`font-medium mb-1 flex items-center gap-1 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  <Tag className="w-3 h-3 text-primary" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-1">
                  {metadata.tags.map((tag) => (
                    <span key={tag} className={`chip chip-cyan ${isCompact ? 'text-2xs' : ''}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tools */}
            {metadata.tools.length > 0 && (
              <div>
                <h4 className={`font-medium mb-1 flex items-center gap-1 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  <Wrench className="w-3 h-3 text-primary" />
                  Tools
                </h4>
                <div className="flex flex-wrap gap-1">
                  {metadata.tools.map((tool) => (
                    <span key={tool} className={`chip chip-emerald ${isCompact ? 'text-2xs' : ''}`}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Career Relevance */}
            {analysis && analysis.length > 0 && (
              <div>
                <h4 className={`font-medium mb-2 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  Career Relevance
                </h4>
                <div className={`space-y-2 ${isCompact ? 'space-y-1.5' : ''}`}>
                  {analysis.map((a) => {
                    const profile = JOB_PROFILES.find(p => p.id === a.jobId);
                    return (
                      <div key={a.jobId} className="bg-muted/30 rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium ${isCompact ? 'text-xs' : 'text-sm'}`}>
                            {profile?.title}
                          </span>
                          <span className={`font-mono font-bold ${getScoreColor(a.score)} ${isCompact ? 'text-sm' : 'text-base'}`}>
                            {a.score}/10
                          </span>
                        </div>
                        <div className="score-bar mb-1">
                          <div 
                            className={`score-fill ${getScoreBarColor(a.score)}`}
                            style={{ width: `${a.score * 10}%` }}
                          />
                        </div>
                        <p className={`text-muted-foreground ${isCompact ? 'text-2xs' : 'text-xs'}`}>
                          {a.reason}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default RoomDetail;
