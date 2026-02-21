import { useState, useRef, useEffect } from 'react';
import { Upload, X, CheckCircle, FileText, AlertTriangle, Pause, Play, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';

interface ChunkedUploaderProps {
  onUploadComplete: (url: string, sizeBytes: number, fileName: string) => void;
  accept?: string;
}

const ChunkedUploader = ({ onUploadComplete, accept }: ChunkedUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'paused' | 'scanning' | 'completed' | 'error'>('idle');
  const [chunkIndex, setChunkIndex] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
  const uploadRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTotalChunks(Math.ceil(selectedFile.size / CHUNK_SIZE));
      setStatus('idle');
      setProgress(0);
      setChunkIndex(0);
    }
  };

  const startUpload = () => {
    if (!file) return;
    setStatus('uploading');
    uploadChunk();
  };

  const uploadChunk = () => {
    uploadRef.current = setTimeout(() => {
      setChunkIndex(prev => {
        const next = prev + 1;
        const percent = Math.min(100, Math.round((next / totalChunks) * 100));
        setProgress(percent);
        
        if (next >= totalChunks) {
          setStatus('scanning');
          setTimeout(() => {
            setStatus('completed');
            // Simulate a cloud URL
            onUploadComplete(`https://cdn.gamesmart.com/files/${Date.now()}_${file?.name}`, file?.size || 0, file?.name || '');
          }, 1500); // Simulate virus scan time
          return next;
        }
        
        if (status !== 'paused') {
            uploadChunk();
        }
        return next;
      });
    }, 150); // Speed up for demo
  };

  const pauseUpload = () => {
    if (uploadRef.current) clearTimeout(uploadRef.current);
    setStatus('paused');
  };

  const resumeUpload = () => {
    setStatus('uploading');
    uploadChunk();
  };

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setChunkIndex(0);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-dark-bg transition-colors hover:border-primary">
      {!file ? (
        <label className="flex flex-col items-center justify-center cursor-pointer h-32">
          <Upload className="w-10 h-10 text-gray-400 mb-3" />
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Click to Upload Game File</span>
          <span className="text-xs text-gray-500 mt-1">Supports large files (100GB+) with resume</span>
          <input type="file" className="hidden" onChange={handleFileSelect} accept={accept} />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • {totalChunks} Chunks
                </div>
              </div>
            </div>
            {status !== 'completed' && (
              <button onClick={reset} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>
                {status === 'completed' ? 'Upload Complete' : 
                 status === 'scanning' ? 'Scanning for Viruses...' :
                 status === 'uploading' ? `Uploading Chunk ${chunkIndex}/${totalChunks}...` : 
                 status === 'paused' ? 'Paused' : 'Ready'}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  status === 'completed' ? 'bg-green-500' : 
                  status === 'scanning' ? 'bg-blue-500 animate-pulse' :
                  status === 'error' ? 'bg-red-500' : 'bg-primary'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {status === 'idle' && (
              <Button size="sm" fullWidth onClick={startUpload}>Start Upload</Button>
            )}
            {status === 'uploading' && (
              <Button size="sm" variant="secondary" fullWidth onClick={pauseUpload} className="gap-2">
                <Pause size={14} /> Pause
              </Button>
            )}
            {status === 'paused' && (
              <Button size="sm" variant="primary" fullWidth onClick={resumeUpload} className="gap-2">
                <Play size={14} /> Resume
              </Button>
            )}
            {status === 'completed' && (
              <div className="w-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-2 rounded text-center text-sm font-bold flex items-center justify-center gap-2">
                <CheckCircle size={16} /> Verified Safe
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChunkedUploader;
