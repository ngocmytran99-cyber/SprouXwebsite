import React, { useState } from 'react';
import { Upload, X, File as FileIcon, Loader2 } from 'lucide-react';
import { MediaAttachment, User } from '../../../types';

interface AddMediaProps {
  setMediaItems: React.Dispatch<React.SetStateAction<MediaAttachment[]>>;
  user: User | null;
  onComplete: () => void;
}

const AddMedia: React.FC<AddMediaProps> = ({ setMediaItems, user, onComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFiles = (files: FileList) => {
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newItems: MediaAttachment[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        fileType: file.type.startsWith('image/') ? 'image' : 'document',
        mimeType: file.type,
        fileSize: file.size,
        url: URL.createObjectURL(file), // Mock URL
        title: file.name.split('.')[0],
        uploadedBy: user?.name || 'Admin',
        createdAt: new Date().toISOString().split('T')[0]
      }));

      setMediaItems(prev => [...newItems, ...prev]);
      setUploading(false);
      onComplete();
    }, 1500);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="animate-in fade-in">
      <h1 className="text-2xl font-medium text-slate-800 mb-6">Upload New Media</h1>
      
      <div 
        className={`w-full max-w-4xl mx-auto h-[400px] border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-12 transition-all ${
          dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={64} className="text-primary animate-spin" />
            <p className="text-lg font-bold text-slate-600">Uploading files...</p>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-6">
              <Upload size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2 text-center">Drop files to upload</h2>
            <p className="text-slate-500 mb-8 text-center">or</p>
            <label className="px-8 py-3 bg-white border border-[#2271b1] text-[#2271b1] font-bold rounded-xl cursor-pointer hover:bg-blue-50 transition-colors shadow-sm">
              Select Files
              <input type="file" multiple className="hidden" onChange={onFileSelect} />
            </label>
            <p className="mt-8 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Maximum upload file size: 256 MB.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AddMedia;