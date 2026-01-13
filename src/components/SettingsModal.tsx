import React, { useState, useCallback } from 'react';
import { X, Key, Cloud, CloudOff, Loader2, Check, AlertCircle, Trash2 } from 'lucide-react';
import { findExistingGist, loadFromGist, saveToGist } from '../services/githubService';
import { GIST_ID_KEY, GITHUB_TOKEN_KEY } from '../constants';
import { RoomData } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  rooms: RoomData[];
  importRooms: (rooms: RoomData[]) => void;
  resetAllRooms: () => void;
  isCompact: boolean;
}

type SyncStatus = 'idle' | 'loading' | 'success' | 'error';

export const SettingsModal = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  rooms,
  importRooms,
  resetAllRooms,
  isCompact,
}: SettingsModalProps) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem(GITHUB_TOKEN_KEY) || '');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  const handleSaveApiKey = useCallback(() => {
    setApiKey(tempApiKey);
    setSyncMessage('API Key saved!');
    setTimeout(() => setSyncMessage(''), 2000);
  }, [tempApiKey, setApiKey]);

  const handleSaveGithubToken = useCallback(() => {
    localStorage.setItem(GITHUB_TOKEN_KEY, githubToken);
    setSyncMessage('GitHub token saved!');
    setTimeout(() => setSyncMessage(''), 2000);
  }, [githubToken]);

  const handlePushToGist = useCallback(async () => {
    if (!githubToken) {
      setSyncMessage('No GitHub token set');
      return;
    }
    setSyncStatus('loading');
    setSyncMessage('Pushing to Gist...');
    try {
      const existingId = localStorage.getItem(GIST_ID_KEY);
      const gistId = await saveToGist(githubToken, rooms, existingId);
      localStorage.setItem(GIST_ID_KEY, gistId);
      setSyncStatus('success');
      setSyncMessage('Pushed to Gist successfully!');
    } catch (e: any) {
      setSyncStatus('error');
      setSyncMessage(e.message || 'Failed to push to Gist');
    }
  }, [githubToken, rooms]);

  const handlePullFromGist = useCallback(async () => {
    if (!githubToken) {
      setSyncMessage('No GitHub token set');
      return;
    }
    setSyncStatus('loading');
    setSyncMessage('Pulling from Gist...');
    try {
      let gistId = localStorage.getItem(GIST_ID_KEY);
      if (!gistId) {
        gistId = await findExistingGist(githubToken);
        if (gistId) localStorage.setItem(GIST_ID_KEY, gistId);
      }
      if (!gistId) {
        setSyncStatus('error');
        setSyncMessage('No existing Gist found');
        return;
      }
      const data = await loadFromGist(githubToken, gistId);
      if (Array.isArray(data)) {
        importRooms(data);
        setSyncStatus('success');
        setSyncMessage(`Pulled ${data.length} rooms from Gist!`);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (e: any) {
      setSyncStatus('error');
      setSyncMessage(e.message || 'Failed to pull from Gist');
    }
  }, [githubToken, importRooms]);

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset all room data? This cannot be undone.')) {
      resetAllRooms();
      onClose();
    }
  }, [resetAllRooms, onClose]);

  if (!isOpen) return null;

  const padding = isCompact ? 'p-3' : 'p-4';
  const gap = isCompact ? 'gap-3' : 'gap-4';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className={`bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4 ${padding}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`flex flex-col ${gap}`}>
          {/* Gemini API Key */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
              <Key className="w-4 h-4 text-primary" />
              Gemini API Key
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="input-compact flex-1"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90"
              >
                Save
              </button>
            </div>
            <p className="text-2xs text-muted-foreground mt-1">
              Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>
            </p>
          </div>

          {/* GitHub Token */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
              <Cloud className="w-4 h-4 text-primary" />
              GitHub Personal Access Token
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_..."
                className="input-compact flex-1"
              />
              <button
                onClick={handleSaveGithubToken}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium hover:bg-secondary/90"
              >
                Save
              </button>
            </div>
            <p className="text-2xs text-muted-foreground mt-1">
              For Gist sync. Needs <code>gist</code> scope.
            </p>
          </div>

          {/* Gist Sync */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Cloud Sync</label>
            <div className="flex gap-2">
              <button
                onClick={handlePushToGist}
                disabled={!githubToken || syncStatus === 'loading'}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded text-xs font-medium hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncStatus === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Cloud className="w-3 h-3" />}
                Push to Gist
              </button>
              <button
                onClick={handlePullFromGist}
                disabled={!githubToken || syncStatus === 'loading'}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-medium hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncStatus === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> : <CloudOff className="w-3 h-3" />}
                Pull from Gist
              </button>
            </div>
          </div>

          {/* Status message */}
          {syncMessage && (
            <div className={`flex items-center gap-2 text-xs ${
              syncStatus === 'success' ? 'text-emerald-400' : 
              syncStatus === 'error' ? 'text-red-400' : 
              'text-muted-foreground'
            }`}>
              {syncStatus === 'success' && <Check className="w-3 h-3" />}
              {syncStatus === 'error' && <AlertCircle className="w-3 h-3" />}
              {syncStatus === 'loading' && <Loader2 className="w-3 h-3 animate-spin" />}
              {syncMessage}
            </div>
          )}

          {/* Danger zone */}
          <div className="pt-3 border-t border-border">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 text-destructive border border-destructive/30 rounded text-xs font-medium hover:bg-destructive/10 w-full justify-center"
            >
              <Trash2 className="w-3 h-3" />
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
