import React, { useState } from 'react';
import { HelpDeskArticle, HelpDeskTopic, HelpDeskCategory } from '../../../types';
import { Edit3, Trash2, Search, Clock, ShieldAlert, Eye } from 'lucide-react';

interface ArticleManagerProps {
  articles: HelpDeskArticle[];
  setArticles: React.Dispatch<React.SetStateAction<HelpDeskArticle[]>>;
  topics: HelpDeskTopic[];
  categories: HelpDeskCategory[];
  onEdit: (article: HelpDeskArticle) => void;
  onPreview: (article: HelpDeskArticle) => void;
}

const ArticleManager: React.FC<ArticleManagerProps> = ({ 
  articles, setArticles, topics, categories, onEdit, onPreview
}) => {
  const [search, setSearch] = useState('');

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this help article?')) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="relative sticky top-0 bg-white z-10 pb-2">
        <Search className="absolute left-4 top-[14px] text-slate-400" size={18} />
        <input 
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary transition-all shadow-inner"
          placeholder="Search help articles by title or slug..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-4 py-3 pb-4">Article Title</th>
              <th className="px-4 py-3 pb-4">Topic / Category</th>
              <th className="px-4 py-3 pb-4">Audience</th>
              <th className="px-4 py-3 pb-4">Status</th>
              <th className="px-4 py-3 pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length > 0 ? filtered.map(article => (
              <tr key={article.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-5 align-top">
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight mb-1">{article.title}</div>
                    <div className="text-[10px] font-mono text-slate-400">/{article.slug}</div>
                  </div>
                  {article.isCritical && (
                    <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[9px] font-black uppercase tracking-widest">
                      <ShieldAlert size={10} /> Critical Reading
                    </div>
                  )}
                </td>
                <td className="px-4 py-5 align-top">
                  <div className="text-xs font-bold text-slate-600 mb-0.5">
                    {topics.find(t => t.id === article.subcategory)?.label || 'Unknown Topic'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {categories.find(c => c.id === article.category)?.label || 'Unknown Cat'}
                  </div>
                </td>
                <td className="px-4 py-5 align-top">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    article.audience === 'creator' ? 'bg-primary/10 text-primary' : 'bg-violet-100 text-violet-700'
                  }`}>
                    {article.audience}
                  </span>
                </td>
                <td className="px-4 py-5 align-top">
                   <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                     article.status === 'published' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                   }`}>
                     {article.status || 'draft'}
                   </span>
                </td>
                <td className="px-4 py-5 align-top text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(article)} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Edit Article">
                      <Edit3 size={16}/>
                    </button>
                    <button onClick={() => onPreview(article)} className="p-2 text-slate-400 hover:text-teal-600 transition-colors" title="Preview Article">
                      <Eye size={16}/>
                    </button>
                    <button onClick={() => handleDelete(article.id)} className="p-2 text-slate-400 hover:text-destructive transition-colors" title="Delete Article">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-4 py-20 text-center text-slate-400 italic">
                  No articles found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticleManager;