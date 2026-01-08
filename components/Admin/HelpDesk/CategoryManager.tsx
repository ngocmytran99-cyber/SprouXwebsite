
import React, { useState } from 'react';
import { HelpDeskCategory, HelpDeskTopic } from '../../../types';
import { Edit3, Trash2, AlertTriangle, Plus, LayoutGrid } from 'lucide-react';
import * as Icons from 'lucide-react';

interface CategoryManagerProps {
  categories: HelpDeskCategory[];
  setCategories: React.Dispatch<React.SetStateAction<HelpDeskCategory[]>>;
  topics: HelpDeskTopic[];
}

const RenderIcon = ({ name, className, size = 16 }: { name: string; className?: string; size?: number }) => {
  const IconComponent = (Icons as any)[name];
  if (IconComponent) {
    return <IconComponent className={className} size={size} />;
  }
  return (
    <span 
      className={`material-symbols-outlined ${className}`} 
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
};

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, setCategories, topics }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<HelpDeskCategory>>({ 
    id: '', label: '', description: '', icon: 'Zap', audience: 'creator' 
  });

  const handleSave = () => {
    if (!form.label || !form.id) return;
    setCategories(prev => {
      const exists = prev.some(c => c.id === form.id);
      if (exists && !editingId) {
        alert('Category ID must be unique.');
        return prev;
      }
      if (editingId) {
        return prev.map(c => c.id === editingId ? (form as HelpDeskCategory) : c);
      }
      return [...prev, form as HelpDeskCategory];
    });
    setForm({ id: '', label: '', description: '', icon: 'Zap', audience: 'creator' });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (topics.some(t => t.categoryId === id)) {
      alert('Cannot delete category: It contains active topics. Please delete or move topics first.');
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{editingId ? 'Edit Category' : 'Create New Category'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField label="Unique ID" value={form.id} onChange={v => setForm({...form, id: v})} placeholder="e.g. billing" disabled={!!editingId} />
          <InputField label="Label" value={form.label} onChange={v => setForm({...form, label: v})} placeholder="e.g. Payments & Billing" />
          <SelectField label="Audience" value={form.audience} onChange={v => setForm({...form, audience: v as any})} options={[{v:'creator', l:'Creator'}, {v:'backer', l:'Backer'}]} />
          <InputField label="Icon Name" value={form.icon} onChange={v => setForm({...form, icon: v})} placeholder="e.g. Zap, face, smart_toy..." />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
          <textarea 
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-primary transition-all min-h-[60px]"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            placeholder="Help users understand what this category covers..."
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          {editingId && <button onClick={() => { setEditingId(null); setForm({id:'', label:'', description:'', icon:'Zap', audience:'creator'}); }} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>}
          <button onClick={handleSave} className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
            {editingId ? 'Update Category' : <><Plus size={14}/> Add Category</>}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Audience</th>
              <th className="px-4 py-3">Topics</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.map(cat => (
              <tr key={cat.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                      <RenderIcon name={cat.icon} size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{cat.label}</div>
                      <div className="text-[10px] font-mono text-slate-400">ID: {cat.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    cat.audience === 'creator' ? 'bg-primary/10 text-primary' : 'bg-violet-100 text-violet-700'
                  }`}>
                    {cat.audience}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs font-bold text-slate-500">
                    {topics.filter(t => t.categoryId === cat.id).length} Topics
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(cat.id); setForm(cat); }} className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-slate-400 hover:text-destructive transition-colors"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder, disabled = false }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      disabled={disabled}
      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-primary transition-all disabled:bg-slate-100 disabled:text-slate-400"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <select 
      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-primary transition-all"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map((o:any) => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);

export default CategoryManager;
