import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Settings, RefreshCw, Maximize, Play } from 'lucide-react';

export default function CodeEditor({ 
  value, 
  onChange, 
  language = 'javascript', 
  theme = 'vs-dark',
  onRun
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`flex flex-col h-full rounded-2xl border transition-all overflow-hidden ${
      isFocused ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-white/10'
    } bg-[#1e1e1e]`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="h-4 w-[1px] bg-white/10 mx-1" />
          <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
            <Code className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">{language}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRun && (
            <button 
              onClick={onRun}
              className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-500/30 transition-all border border-emerald-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              RUN CODE
            </button>
          )}
          <button className="p-1.5 hover:bg-white/5 rounded-lg text-text-muted transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 hover:bg-white/5 rounded-lg text-text-muted transition-colors">
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative min-h-[300px]">
        <Editor
          height="100%"
          defaultLanguage={language}
          defaultValue={value}
          value={value}
          theme={theme}
          onChange={onChange}
          onMount={() => setIsFocused(true)}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden'
            },
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
          }}
        />
      </div>

      {/* Footer Status */}
      <div className="px-4 py-1.5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
        <div className="flex items-center gap-4 text-[10px] text-text-muted uppercase tracking-widest font-medium">
          <span>UTF-8</span>
          <span>Tab Size: 2</span>
        </div>
        <div className="text-[10px] text-text-muted font-medium">
          Powered by Monaco Editor
        </div>
      </div>
    </div>
  );
}
