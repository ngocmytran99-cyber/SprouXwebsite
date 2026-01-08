
import React, { useState, useMemo } from 'react';
// Added Image as ImageIcon to fix the "Cannot find name 'ImageIcon'" error
import { Search, Trash2, Info, X, Upload, Loader2, Plus, AlertTriangle, Sparkles, Wand2, RefreshCw, Check, Download, Image as ImageIcon } from 'lucide-react';
import { MediaAttachment, MediaType, User } from '../../../types';
import { GoogleGenAI } from "@google/genai";

interface MediaLibraryProps {
  mediaItems: MediaAttachment[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaAttachment[]>>;
  user: User | null;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ mediaItems, setMediaItems, user }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<MediaAttachment | null>(null);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // AI Generator State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aiAspectRatio, setAiAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');

  // Form state for attachment details
  const [editTitle, setEditTitle] = useState('');
  const [editAlt, setEditAlt] = useState('');

  const filteredItems = useMemo(() => {
    return mediaItems.filter(item => {
      const matchesSearch = item.fileName.toLowerCase().includes(search.toLowerCase()) || 
                          item.title.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || item.fileType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [mediaItems, search, typeFilter]);

  const handleSelectItem = (item: MediaAttachment) => {
    setSelectedItem(item);
    setEditTitle(item.title);
    setEditAlt(item.altText || '');
  };

  const generateAiImage = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: aiPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aiAspectRatio
          }
        }
      });

      let base64Data = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Data = part.inlineData.data;
          break;
        }
      }

      if (base64Data) {
        setGeneratedImage(`data:image/png;base64,${base64Data}`);
      } else {
        alert("AI could not generate an image part in the response.");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Error generating image. Please try a different prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveAiImageToLibrary = () => {
    if (!generatedImage) return;

    const newItem: MediaAttachment = {
      id: Math.random().toString(36).substr(2, 9),
      fileName: `ai-gen-${Date.now()}.png`,
      fileType: 'image',
      mimeType: 'image/png',
      fileSize: Math.floor(generatedImage.length * 0.75), // rough estimate
      url: generatedImage,
      title: aiPrompt.substring(0, 30) || 'AI Generated Image',
      altText: aiPrompt,
      uploadedBy: user?.name || 'AI Assistant',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setMediaItems(prev => [newItem, ...prev]);
    setShowAiGenerator(false);
    setGeneratedImage(null);
    setAiPrompt('');
    alert("Image added to library!");
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setMediaItems(prev => prev.filter(item => item.id !== itemToDelete));
      if (selectedItem?.id === itemToDelete) {
        setSelectedItem(null);
      }
      setItemToDelete(null);
    }
  };

  const handleSaveDetails = () => {
    if (!selectedItem) return;

    setMediaItems(prev => prev.map(item => 
      item.id === selectedItem.id 
        ? { ...item, title: editTitle, altText: editAlt } 
        : item
    ));
    setSelectedItem(null);
  };

  const handleFiles = (files: FileList) => {
    setUploading(true);
    setTimeout(() => {
      const newItems: MediaAttachment[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        fileType: file.type.startsWith('image/') ? 'image' : 'document',
        mimeType: file.type,
        fileSize: file.size,
        url: URL.createObjectURL(file),
        title: file.name.split('.')[0],
        uploadedBy: user?.name || 'Admin',
        createdAt: new Date().toISOString().split('T')[0]
      }));

      setMediaItems(prev => [...newItems, ...prev]);
      setUploading(false);
      setShowUploadArea(false);
    }, 1200);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

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
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-medium text-slate-800">Media Library</h1>
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/50 rounded-lg">
            <button 
              onClick={() => { setShowUploadArea(!showUploadArea); setShowAiGenerator(false); }}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all flex items-center gap-1.5 ${showUploadArea ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {showUploadArea ? <X size={12} /> : <Plus size={12} />}
              Upload
            </button>
            <button 
              onClick={() => { setShowAiGenerator(!showAiGenerator); setShowUploadArea(false); }}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all flex items-center gap-1.5 ${showAiGenerator ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Sparkles size={12} className={showAiGenerator ? 'text-primary' : 'text-slate-400'} />
              AI Generate
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="border border-slate-300 text-[11px] px-2 py-1.5 rounded bg-white outline-none"
          >
            <option value="all">All media items</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search media..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-[11px] outline-none w-48 bg-white"
            />
          </div>
        </div>
      </div>

      {/* AI Generator Panel */}
      {showAiGenerator && (
        <div className="bg-white border border-primary/20 rounded-[2rem] p-8 shadow-xl shadow-primary/5 animate-in slide-in-from-top duration-500">
           <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                       <Wand2 size={16} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Magic Image Generator</h2>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prompt</label>
                    <textarea 
                       className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all min-h-[100px] resize-none"
                       placeholder="A professional high-quality photo of a tech sprout in a futuristic lab, cinematic lighting, 8k..."
                       value={aiPrompt}
                       onChange={e => setAiPrompt(e.target.value)}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aspect Ratio</label>
                       <div className="flex gap-2">
                          {(['1:1', '16:9', '9:16', '4:3'] as const).map(ratio => (
                             <button 
                                key={ratio}
                                onClick={() => setAiAspectRatio(ratio)}
                                className={`flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all ${aiAspectRatio === ratio ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                             >
                                {ratio}
                             </button>
                          ))}
                       </div>
                    </div>
                    <div className="flex items-end">
                       <button 
                          disabled={isGenerating || !aiPrompt.trim()}
                          onClick={generateAiImage}
                          className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg active:scale-95"
                       >
                          {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                          {isGenerating ? 'Generating...' : 'Create Magic'}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="w-full lg:w-80 h-80">
                 <div className={`w-full h-full rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden relative group ${generatedImage ? 'border-success' : 'border-slate-200 bg-slate-50'}`}>
                    {isGenerating ? (
                       <div className="flex flex-col items-center gap-3">
                          <div className="relative">
                             <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                             <Wand2 size={48} className="text-primary relative z-10 animate-bounce" />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Visualizing...</span>
                       </div>
                    ) : generatedImage ? (
                       <>
                          <img src={generatedImage} className="w-full h-full object-cover" alt="Generated" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                             <p className="text-white text-xs font-bold mb-4">Your masterpiece is ready!</p>
                             <button 
                                onClick={saveAiImageToLibrary}
                                className="w-full py-2.5 bg-success text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all"
                             >
                                <Check size={14}/> Add to Library
                             </button>
                          </div>
                       </>
                    ) : (
                       <div className="text-center p-6">
                          <ImageIcon size={40} className="text-slate-200 mx-auto mb-3" />
                          <p className="text-[10px] font-bold text-slate-300 uppercase leading-relaxed">Preview will appear here after generation</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Upload Area */}
      {showUploadArea && (
        <div 
          className={`w-full h-48 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-8 transition-all animate-in slide-in-from-top duration-300 ${
            dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-slate-300 bg-white hover:border-slate-400'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={32} className="text-primary animate-spin" />
              <p className="text-sm font-bold text-slate-600">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                <Upload size={24} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Drop files to upload</h2>
              <p className="text-xs text-slate-500 mb-4">Maximum upload file size: 256 MB.</p>
              <label className="px-6 py-2 bg-white border border-[#2271b1] text-[#2271b1] text-xs font-bold rounded-xl cursor-pointer hover:bg-blue-50 transition-colors shadow-sm">
                Select Files
                <input type="file" multiple className="hidden" onChange={onFileSelect} />
              </label>
            </>
          )}
        </div>
      )}

      {/* Grid Area */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 pb-10">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            onClick={() => handleSelectItem(item)}
            className={`aspect-square relative bg-white border-2 rounded overflow-hidden cursor-pointer group transition-all ${
              selectedItem?.id === item.id ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {item.fileType === 'image' ? (
              <img src={item.url} className="w-full h-full object-cover" alt={item.title} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                <Info size={32} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); setItemToDelete(item.id); }}
                className="p-1.5 bg-red-600 text-white rounded-md shadow-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
            {item.uploadedBy === 'AI Assistant' && (
              <div className="absolute bottom-1 right-1">
                 <Sparkles size={10} className="text-amber-400 drop-shadow-md" />
              </div>
            )}
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium bg-white/50 rounded-3xl border border-dashed border-slate-200">
            No media items found.
          </div>
        )}
      </div>

      {/* Details Side-Panel */}
      {selectedItem && (
        <div className="fixed inset-0 z-[120] bg-black/60 flex justify-end">
          <div className="w-[400px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-widest">Attachment Details</h3>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-center border border-slate-200 min-h-[200px]">
                {selectedItem.fileType === 'image' ? (
                  <img src={selectedItem.url} className="max-w-full max-h-[300px] shadow-sm rounded" alt="" />
                ) : (
                  <Info size={64} className="text-slate-300" />
                )}
              </div>
              <div className="space-y-4 text-[12px]">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 font-bold uppercase">File name:</span>
                  <span className="col-span-2 text-slate-900 truncate font-medium">{selectedItem.fileName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 font-bold uppercase">Uploaded by:</span>
                  <span className="col-span-2 text-slate-900 font-medium">{selectedItem.uploadedBy}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 font-bold uppercase">File size:</span>
                  <span className="col-span-2 text-slate-900 font-medium">{(selectedItem.fileSize / 1024).toFixed(1)} KB</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-400 font-bold uppercase">Uploaded on:</span>
                  <span className="col-span-2 text-slate-900 font-medium">{selectedItem.createdAt}</span>
                </div>
              </div>
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Title</label>
                  <input 
                    className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:border-primary bg-white text-slate-900" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Alt Text</label>
                  <input 
                    className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:border-primary bg-white text-slate-900" 
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
              <button 
                onClick={() => setItemToDelete(selectedItem.id)}
                className="text-red-600 font-bold text-[11px] hover:underline flex items-center gap-1 group"
              >
                <Trash2 size={12} className="group-hover:scale-110 transition-transform" /> Delete Permanently
              </button>
              <button 
                onClick={handleSaveDetails}
                className="px-6 py-2 bg-primary text-white font-bold text-[11px] rounded shadow-sm hover:bg-teal-800 transition-colors"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Delete Permanently?</h3>
            <p className="text-sm text-slate-500 mb-8 text-center leading-relaxed">
              This action cannot be undone. You are about to permanently delete this media item from your library.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
