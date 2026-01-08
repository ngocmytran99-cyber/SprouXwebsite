import React, { useState } from 'react';
import { 
  FolderTree, 
  Hash, 
  FileText, 
  ArrowLeft,
  Search,
  Plus,
  X,
  ChevronRight,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Home
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { HelpDeskCategory, HelpDeskTopic, HelpDeskArticle, MediaAttachment } from '../../../types';
import CategoryManager from './CategoryManager';
import TopicManager from './TopicManager';
import ArticleManager from './ArticleManager';
import ArticleEditor from './ArticleEditor';

interface HelpDeskManagerProps {
  categories: HelpDeskCategory[];
  setCategories: React.Dispatch<React.SetStateAction<HelpDeskCategory[]>>;
  topics: HelpDeskTopic[];
  setTopics: React.Dispatch<React.SetStateAction<HelpDeskTopic[]>>;
  articles: HelpDeskArticle[];
  setArticles: React.Dispatch<React.SetStateAction<HelpDeskArticle[]>>;
  mediaItems: MediaAttachment[];
}

type HdTab = 'categories' | 'topics' | 'articles';

const HelpDeskManager: React.FC<HelpDeskManagerProps> = ({ 
  categories, setCategories, 
  topics, setTopics, 
  articles, setArticles,
  mediaItems
}) => {
  const [activeHdTab, setActiveHdTab] = useState<HdTab>('articles');
  const [editingArticle, setEditingArticle] = useState<HelpDeskArticle | null>(null);
  const [previewArticle, setPreviewArticle] = useState<HelpDeskArticle | null>(null);

  if (editingArticle) {
    return (
      <ArticleEditor 
        article={editingArticle}
        categories={categories}
        topics={topics}
        onSave={(updated) => {
          setArticles(prev => {
            const exists = prev.some(a => a.id === updated.id);
            return exists ? prev.map(a => a.id === updated.id ? updated : a) : [...prev, updated];
          });
          setEditingArticle(null);
        }}
        onCancel={() => setEditingArticle(null)}
        mediaItems={mediaItems}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <TabButton 
            active={activeHdTab === 'articles'} 
            onClick={() => setActiveHdTab('articles')}
            icon={<FileText size={16}/>}
            label="Articles"
            count={articles.length}
          />
          <TabButton 
            active={activeHdTab === 'topics'} 
            onClick={() => setActiveHdTab('topics')}
            icon={<Hash size={16}/>}
            label="Topics"
            count={topics.length}
          />
          <TabButton 
            active={activeHdTab === 'categories'} 
            onClick={() => setActiveHdTab('categories')}
            icon={<FolderTree size={16}/>}
            label="Categories"
            count={categories.length}
          />
        </div>

        {activeHdTab === 'articles' && (
          <button 
            onClick={() => setEditingArticle({
              id: Math.max(...articles.map(a => a.id), 0) + 1,
              slug: '',
              title: '',
              description: '',
              content: '',
              readingTime: 5,
              audience: 'creator',
              category: '',
              subcategory: '',
              icon: 'FileText',
              updatedAt: new Date().toLocaleDateString(),
              status: 'draft'
            })}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-primary/10"
          >
            <Plus size={14}/> Create Article
          </button>
        )}
      </div>

      {/* FIXED: Changed overflow-hidden to overflow-y-auto to fix the scrolling issue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-y-auto flex-1 custom-scrollbar">
        {activeHdTab === 'categories' && (
          <CategoryManager 
            categories={categories} 
            setCategories={setCategories} 
            topics={topics} 
          />
        )}
        {activeHdTab === 'topics' && (
          <TopicManager 
            topics={topics} 
            setTopics={setTopics} 
            categories={categories} 
            articles={articles} 
          />
        )}
        {activeHdTab === 'articles' && (
          <ArticleManager 
            articles={articles} 
            setArticles={setArticles} 
            topics={topics} 
            categories={categories}
            onEdit={setEditingArticle}
            onPreview={setPreviewArticle}
          />
        )}
      </div>

      {/* Article Preview Overlay */}
      {previewArticle && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in">
          <div className="bg-white w-full max-w-5xl h-full rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative border border-slate-200">
            {/* Header controls */}
            <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                previewArticle.status === 'published' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                Preview: {previewArticle.status || 'draft'}
              </div>
              <button 
                onClick={() => setPreviewArticle(null)}
                className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20">
                {/* Breadcrumbs */}
                <nav className="flex items-center text-[10px] md:text-xs text-slate-400 mb-10 font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <Home size={14} /> Help Home
                  </div>
                  <ChevronRight size={14} className="mx-3 opacity-30" />
                  <span className="capitalize">{previewArticle.audience} Center</span>
                  <ChevronRight size={14} className="mx-3 opacity-30" />
                  <span className="text-slate-900 truncate">Preview Article</span>
                </nav>

                <article>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                      {React.createElement((Icons as any)[previewArticle.icon] || Icons.FileText, { size: 28 })}
                    </div>
                    {previewArticle.isCritical && (
                      <span className="bg-teal-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                          Essential Reading
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-slate-900 mb-6 leading-tight">
                    {previewArticle.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-10 pb-10 border-b border-slate-50">
                    <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span className="font-medium">{previewArticle.readingTime} minute read</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <span className="text-teal-600 font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full text-xs">
                        {topics.find(s => s.id === previewArticle.subcategory)?.label || 'Uncategorized'}
                    </span>
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <span className="font-medium">Updated {previewArticle.updatedAt}</span>
                  </div>

                  <div 
                    className="prose prose-teal prose-lg max-w-none text-slate-700 leading-relaxed font-normal help-desk-preview-body"
                    dangerouslySetInnerHTML={{ __html: previewArticle.content }}
                  />

                  <div className="mt-16 pt-10 border-t border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 text-center md:text-left">Was this article helpful?</h3>
                    <div className="flex justify-center md:justify-start gap-4">
                      <button className="flex items-center gap-3 px-8 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-700 font-bold hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm">
                        <ThumbsUp size={18} /> Yes
                      </button>
                      <button className="flex items-center gap-3 px-8 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-700 font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm">
                        <ThumbsDown size={18} /> No
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{ __html: `
            .help-desk-preview-body h2 { font-family: 'Fraunces', serif; color: #0f172a; font-weight: 800; margin-top: 2.5rem; margin-bottom: 1.25rem; font-size: 1.875rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
            .help-desk-preview-body h3 { font-family: 'Fraunces', serif; color: #1e293b; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem; }
            .help-desk-preview-body p { margin-bottom: 1.5rem; font-size: 1.125rem; }
            .help-desk-preview-body ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
            .help-desk-preview-body ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem; }
            .help-desk-preview-body li { margin-bottom: 0.5rem; font-size: 1.125rem; }
            .help-desk-preview-body blockquote { border-left: 4px solid #0f766e; padding-left: 1.5rem; font-style: italic; color: #475569; margin: 2rem 0; font-size: 1.25rem; }
            .help-desk-preview-body img { max-width: 100%; height: auto; border-radius: 1.5rem; margin: 2.5rem auto; display: block; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1); }
          `}} />
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count: number }> = ({ active, onClick, icon, label, count }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs ${
      active ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-white border border-transparent hover:border-slate-200'
    }`}
  >
    {icon} 
    <span>{label}</span>
    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
      {count}
    </span>
  </button>
);

export default HelpDeskManager;