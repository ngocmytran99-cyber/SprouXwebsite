
import React, { useState, useMemo } from 'react';
import { 
  X, ChevronLeft, Smartphone, Monitor, Tablet, ImageIcon, 
  Type, Sparkles, Lock, MousePointer2, AlertCircle, Edit3,
  Trash2, ChevronUp, ChevronDown, List, Search, AlertTriangle
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { PageData, ContentBlock, MediaAttachment } from '../../../types';

interface VisualEditorProps {
  page: PageData;
  mediaItems: MediaAttachment[];
  onSave: (id: string, blocks: ContentBlock[], status: 'draft' | 'published' | 'private') => void;
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  'Rocket', 'Cpu', 'ShieldCheck', 'Zap', 'Heart', 'Settings', 'Target', 'CheckCircle2', 
  'Activity', 'Award', 'Anchor', 'Box', 'Camera', 'Cloud', 'Database', 'FileText', 'Globe', 'HelpCircle', 'Coins'
];

const VisualEditor: React.FC<VisualEditorProps> = ({ page, mediaItems, onSave, onClose }) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(page.blocks);
  const [status, setStatus] = useState<'draft' | 'published' | 'private'>(page.status);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hasChanges, setHasChanges] = useState(false);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);

  const activeBlock = blocks.find(b => b.id === selectedBlockId);

  const handleUpdateValue = (id: string, value: string, metadata?: any) => {
    setBlocks(prev => prev.map(b => b.id === id ? { 
      ...b, 
      value, 
      metadata: { ...b.metadata, ...metadata } 
    } : b));
    setHasChanges(true);
  };

  const handleAddBlock = (type: string) => {
    const newId = `custom-${type}-${Math.random().toString(36).substr(2, 5)}`;
    let defaultValue = 'Enter content here...';
    let label = `New ${type.charAt(0).toUpperCase() + type.slice(1)} Block`;
    let group = 'General';

    if (type === 'pricing-plan') {
      defaultValue = JSON.stringify({
        name: 'New Plan',
        price: '$0',
        description: 'Plan description',
        features: ['Feature 1', 'Feature 2'],
        ctaText: 'Buy Now',
        ctaVariant: 'primary',
        icon: 'Rocket'
      });
      label = 'Pricing Plan Card';
      group = 'Pricing Plans';
    } else if (type === 'faq-item') {
      defaultValue = JSON.stringify({
        question: 'New Question?',
        answer: 'Enter answer here...'
      });
      label = 'FAQ Item';
      group = 'FAQs';
    } else if (type === 'image') {
      defaultValue = 'https://picsum.photos/800/600';
      label = 'New Image';
    }

    const newBlock: ContentBlock = {
      id: newId,
      type: type as any,
      label: label,
      value: defaultValue,
      metadata: {
        group: group,
        editable: true
      }
    };
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newId);
    setHasChanges(true);
  };

  const confirmDeleteBlock = () => {
    if (blockToDelete) {
      setBlocks(prev => prev.filter(b => b.id !== blockToDelete));
      if (selectedBlockId === blockToDelete) setSelectedBlockId(null);
      setHasChanges(true);
      setBlockToDelete(null);
    }
  };

  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      const newBlocks = [...prev];
      if (direction === 'up' && index > 0) {
        [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
      } else if (direction === 'down' && index < newBlocks.length - 1) {
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      }
      return newBlocks;
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(page.id, blocks, status);
    setHasChanges(false);
  };

  const groupedBlocks = useMemo(() => {
    const groups: Record<string, ContentBlock[]> = {};
    blocks.forEach(b => {
      const g = b.metadata?.group || 'General';
      if (!groups[g]) groups[g] = [];
      groups[g].push(b);
    });
    return groups;
  }, [blocks]);

  const handleSelectMedia = (item: MediaAttachment) => {
    if (activeBlock && activeBlock.type === 'image') {
      handleUpdateValue(activeBlock.id, item.url, { alt: item.altText || item.title });
      setIsMediaSelectorOpen(false);
    }
  };

  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-widest";

  return (
    <div className="fixed inset-0 z-[200] bg-slate-100 flex flex-col font-sans overflow-hidden text-slate-900">
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-30 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Visual Editor Draft</span>
            <span className="text-sm font-bold text-white">{page.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-3 bg-slate-800/50 p-1 rounded-lg">
             <button onClick={() => setViewport('desktop')} className={`p-1.5 rounded ${viewport === 'desktop' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500'}`}><Monitor size={16}/></button>
             <button onClick={() => setViewport('tablet')} className={`p-1.5 rounded ${viewport === 'tablet' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500'}`}><Tablet size={16}/></button>
             <button onClick={() => setViewport('mobile')} className={`p-1.5 rounded ${viewport === 'mobile' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500'}`}><Smartphone size={16}/></button>
           </div>
           
           <div className="h-8 w-px bg-slate-800"></div>

           <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visibility:</label>
              <select 
                value={status}
                onChange={(e) => { setStatus(e.target.value as any); setHasChanges(true); }}
                className="bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded border border-slate-700 outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="private">Private</option>
              </select>
           </div>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && <div className="flex items-center gap-1.5 text-amber-400 animate-pulse"><AlertCircle size={14} /><span className="text-[10px] font-bold uppercase">Modified</span></div>}
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-6 py-1.5 bg-primary text-white text-xs font-bold rounded hover:bg-teal-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            Publish Changes
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Node Management */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Page Structure</h3>
             <div className="flex gap-1">
               <button onClick={() => handleAddBlock('pricing-plan')} className="p-1.5 hover:bg-white hover:text-primary rounded-lg border border-transparent hover:border-slate-200 transition-all" title="Add Pricing Plan"><Sparkles size={14}/></button>
               <button onClick={() => handleAddBlock('faq-item')} className="p-1.5 hover:bg-white hover:text-primary rounded-lg border border-transparent hover:border-slate-200 transition-all" title="Add FAQ"><List size={14}/></button>
               <button onClick={() => handleAddBlock('image')} className="p-1.5 hover:bg-white hover:text-primary rounded-lg border border-transparent hover:border-slate-200 transition-all" title="Add Image"><ImageIcon size={14}/></button>
               <button onClick={() => handleAddBlock('text')} className="p-1.5 hover:bg-white hover:text-primary rounded-lg border border-transparent hover:border-slate-200 transition-all" title="Add Text"><Type size={14}/></button>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
             {(Object.entries(groupedBlocks) as [string, ContentBlock[]][]).map(([groupName, groupBlocks]) => (
               <div key={groupName} className="space-y-1">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">{groupName}</p>
                 <div className="space-y-1">
                   {groupBlocks.map((block) => {
                     return (
                       <div key={block.id} className="relative group/node">
                         <button 
                          onClick={() => setSelectedBlockId(block.id)}
                          onMouseEnter={() => setHoveredBlockId(block.id)}
                          onMouseLeave={() => setHoveredBlockId(null)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                            selectedBlockId === block.id 
                              ? 'bg-primary text-white shadow-lg ring-4 ring-primary/10' 
                              : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                          }`}
                         >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              selectedBlockId === block.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {block.type === 'pricing-plan' ? <Sparkles size={16}/> : block.type === 'faq-item' ? <List size={16}/> : block.type === 'image' ? <ImageIcon size={16}/> : <Type size={16}/>}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-black uppercase tracking-tighter opacity-60 ${selectedBlockId === block.id ? 'text-white' : 'text-slate-400'}`}>{block.type}</span>
                              </div>
                              <span className="text-xs font-bold truncate leading-none block">{block.label}</span>
                            </div>
                         </button>

                         <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-all duration-200 ${
                           hoveredBlockId === block.id && selectedBlockId !== block.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
                         }`}>
                           <button onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.id, 'up'); }} className="p-1 bg-white border rounded text-slate-400 hover:text-primary transition-colors shadow-sm"><ChevronUp size={12}/></button>
                           <button onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.id, 'down'); }} className="p-1 bg-white border rounded text-slate-400 hover:text-primary transition-colors shadow-sm"><ChevronDown size={12}/></button>
                           <button onClick={(e) => { e.stopPropagation(); setBlockToDelete(block.id); }} className="p-1 bg-white border rounded text-slate-400 hover:text-destructive transition-colors shadow-sm"><Trash2 size={12}/></button>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             ))}
          </div>
        </aside>

        {/* Workspace: Isolated Preview */}
        <main className="flex-1 bg-slate-200 overflow-hidden flex flex-col items-center p-8 relative">
           <div 
             className={`bg-white shadow-2xl transition-all duration-500 border border-slate-300 rounded-[2.5rem] overflow-hidden overflow-y-auto ${
               viewport === 'desktop' ? 'w-full' : viewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'
             }`}
           >
              <div className="relative min-h-[1000px] pointer-events-auto bg-slate-50/50">
                 {/* Simplified Preview for Pricing Page */}
                 <div className="p-12 text-center bg-white border-b border-slate-100">
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                       {blocks.find(b => b.id === 'pricing-hero-title')?.value}
                    </h2>
                    <p className="text-slate-500 max-w-lg mx-auto">
                       {blocks.find(b => b.id === 'pricing-hero-desc')?.value}
                    </p>
                 </div>

                 <div className="p-12 grid grid-cols-3 gap-6">
                    {blocks.filter(b => b.type === 'pricing-plan').map(plan => {
                       let data: any = { name: 'Plan', price: '$TBD' };
                       try { data = JSON.parse(plan.value); } catch(e) {}
                       return (
                          <div key={plan.id} onClick={() => setSelectedBlockId(plan.id)} className={`p-8 rounded-[2rem] border-2 transition-all cursor-pointer ${selectedBlockId === plan.id ? 'border-primary bg-white shadow-xl' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                             <div className="w-10 h-10 bg-slate-50 rounded-xl mb-6 flex items-center justify-center">
                                <DynamicIcon name={data.icon || 'Rocket'} size={20} className="text-primary" />
                             </div>
                             <h3 className="font-bold text-lg mb-1">{data.name}</h3>
                             <p className="text-2xl font-serif font-bold mb-4">{data.price}</p>
                             <div className="space-y-2 opacity-40">
                                <div className="h-1.5 bg-slate-200 rounded-full w-full"></div>
                                <div className="h-1.5 bg-slate-200 rounded-full w-3/4"></div>
                             </div>
                          </div>
                       )
                    })}
                 </div>

                 <div className="p-12 border-t border-slate-100 max-w-2xl mx-auto space-y-4">
                    <h3 className="text-center font-serif font-bold text-xl mb-8">FAQ Preview</h3>
                    {blocks.filter(b => b.type === 'faq-item').map(faq => {
                       let data: any = { question: 'Question' };
                       try { data = JSON.parse(faq.value); } catch(e) {}
                       return (
                          <div key={faq.id} onClick={() => setSelectedBlockId(faq.id)} className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedBlockId === faq.id ? 'border-primary bg-white' : 'border-slate-100 bg-white'}`}>
                             <h4 className="font-bold text-sm">{data.question}</h4>
                          </div>
                       )
                    })}
                 </div>
              </div>
           </div>
        </main>

        {/* Sidebar: Node Properties */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col overflow-hidden shadow-2xl z-20">
          <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
             <h3 className="text-sm font-bold text-slate-900">Node Properties</h3>
             {activeBlock && <div className="text-[10px] font-black px-2 py-0.5 bg-primary/10 text-primary rounded uppercase">{activeBlock.type}</div>}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {activeBlock ? (
              <div className="space-y-6">
                {activeBlock.type === 'pricing-plan' ? (
                  <PricingPlanEditor block={activeBlock} onUpdate={handleUpdateValue} />
                ) : activeBlock.type === 'faq-item' ? (
                  <FAQEditor block={activeBlock} onUpdate={handleUpdateValue} />
                ) : activeBlock.type === 'image' ? (
                  <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <div className="space-y-2">
                       <label className={labelClasses}>{activeBlock.label}</label>
                       <div className="relative group aspect-[4/3] rounded-[1.5rem] overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                          <img src={activeBlock.value} className="w-full h-full object-cover" alt="Node" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                             <button 
                                onClick={() => setIsMediaSelectorOpen(true)}
                                className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
                             >
                                <ImageIcon size={14}/> Replace Image
                             </button>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase">Alt Text</label>
                       <input 
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-primary transition-all" 
                          value={activeBlock.metadata?.alt || ''}
                          onChange={(e) => handleUpdateValue(activeBlock.id, activeBlock.value, { alt: e.target.value })}
                          placeholder="Image description..."
                       />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className={labelClasses}>{activeBlock.label}</label>
                    <textarea 
                      className="w-full min-h-[160px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all shadow-inner leading-relaxed"
                      value={activeBlock.value}
                      onChange={(e) => handleUpdateValue(activeBlock.id, e.target.value)}
                    />
                  </div>
                )}
                
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Block ID</label>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded text-xs font-mono text-slate-400">{activeBlock.id}</div>
                  </div>
                  <button 
                    onClick={() => setBlockToDelete(activeBlock.id)}
                    className="w-full py-3 bg-destructive/5 text-destructive text-xs font-bold rounded-xl hover:bg-destructive hover:text-white transition-all border border-destructive/10"
                  >
                    Remove from draft
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-100 mb-6">
                    <MousePointer2 size={40} />
                 </div>
                 <h4 className="text-sm font-bold text-slate-800 mb-2">Selection Required</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">Select a node to edit its properties.</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Embedded Media Selector Modal */}
      {isMediaSelectorOpen && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-4xl h-[600px] flex flex-col shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                 <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-900">Select Image</h2>
                    <div className="relative">
                       <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input type="text" placeholder="Search media..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none w-64" />
                    </div>
                 </div>
                 <button onClick={() => setIsMediaSelectorOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                    <X size={24} />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 bg-white">
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {mediaItems.filter(m => m.fileType === 'image').map(item => (
                       <div 
                         key={item.id} 
                         onClick={() => handleSelectMedia(item)}
                         className="aspect-square bg-slate-50 border-2 border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:border-primary transition-all group relative"
                       >
                          <img src={item.url} className="w-full h-full object-cover" alt={item.title} />
                          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <div className="bg-white p-2 rounded-full shadow-lg">
                                <Icons.Check size={16} className="text-primary" />
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="p-4 border-t bg-slate-50 flex justify-end">
                 <button onClick={() => setIsMediaSelectorOpen(false)} className="px-6 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl">Cancel</button>
              </div>
           </div>
        </div>
      )}

      {/* Custom Confirmation Modal for Block Deletion */}
      {blockToDelete && (
        <div className="fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Remove Block?</h3>
            <p className="text-sm text-slate-500 mb-8 text-center leading-relaxed">
              Are you sure you want to remove this block from the draft? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setBlockToDelete(null)} 
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteBlock} 
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Custom Editor Components ---

const PricingPlanEditor: React.FC<{ block: ContentBlock; onUpdate: (id: string, val: string, meta?: any) => void }> = ({ block, onUpdate }) => {
  let data: any = {};
  try { data = JSON.parse(block.value); } catch(e) { data = {}; }

  const handleChange = (field: string, val: any) => {
    const newData = { ...data, [field]: val };
    onUpdate(block.id, JSON.stringify(newData));
  };

  const toggleHighlight = (e: any) => {
    onUpdate(block.id, block.value, { highlighted: e.target.checked });
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Name</label>
        <input type="text" value={data.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Text</label>
        <input type="text" value={data.price} onChange={(e) => handleChange('price', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
        <textarea value={data.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm min-h-[60px]" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Features (comma separated)</label>
        <textarea 
          value={data.features?.join(', ')} 
          onChange={(e) => handleChange('features', e.target.value.split(',').map(s => s.trim()))} 
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm min-h-[100px]" 
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CTA Text</label>
          <input type="text" value={data.ctaText} onChange={(e) => handleChange('ctaText', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Variant</label>
          <select value={data.ctaVariant} onChange={(e) => handleChange('ctaVariant', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Icon Name</label>
        <select value={data.icon} onChange={(e) => handleChange('icon', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          {AVAILABLE_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2 py-2">
        <input type="checkbox" checked={block.metadata?.highlighted} onChange={toggleHighlight} className="rounded" />
        <label className="text-xs font-bold text-slate-700">Highlight this card?</label>
      </div>
    </div>
  );
};

const FAQEditor: React.FC<{ block: ContentBlock; onUpdate: (id: string, val: string) => void }> = ({ block, onUpdate }) => {
  let data: any = {};
  try { data = JSON.parse(block.value); } catch(e) { data = {}; }

  const handleChange = (field: string, val: string) => {
    const newData = { ...data, [field]: val };
    onUpdate(block.id, JSON.stringify(newData));
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question</label>
        <input type="text" value={data.question} onChange={(e) => handleChange('question', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Answer (HTML allowed)</label>
        <textarea value={data.answer} onChange={(e) => handleChange('answer', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm min-h-[120px]" />
      </div>
    </div>
  );
};

const DynamicIcon = ({ name, size, className }: { name: string; size: number; className?: string }) => {
  const Icon = (Icons as any)[name] || Icons.HelpCircle;
  return <Icon size={size} className={className} />;
};

export default VisualEditor;
