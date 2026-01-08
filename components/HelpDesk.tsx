
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  ChevronRight, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  ArrowLeft, 
  Home, 
  FileText, 
  LayoutGrid,
  ChevronLeft,
  MessageCircle,
  LifeBuoy,
  Users
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { Article, CategoryMetadata, SubcategoryMetadata, AudienceType, HelpDeskCategory, HelpDeskTopic, HelpDeskArticle } from '../types';

interface HelpDeskProps {
  onNavigate: (view: 'home' | 'pricing' | 'how-it-works' | 'help-desk') => void;
  content?: Record<string, string>;
  categories: HelpDeskCategory[];
  topics: HelpDeskTopic[];
  articles: HelpDeskArticle[];
}

const DynamicIcon = ({ name, className, size = 24 }: { name: string; className?: string; size?: number }) => {
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

const HelpDesk: React.FC<HelpDeskProps> = ({ onNavigate, categories, topics, articles }) => {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<{
    view: 'home' | 'category' | 'subcategory' | 'article' | 'search';
    selectedId?: string;
    searchQuery?: string;
  }>({ view: 'home' });

  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('creator');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Derived Data
  const currentCategory = useMemo(() => 
    categories.find(c => c.id === currentPath.selectedId), [currentPath.selectedId, categories]);
  
  const currentSubcategory = useMemo(() => 
    topics.find(s => s.id === currentPath.selectedId), [currentPath.selectedId, topics]);

  const currentArticle = useMemo(() => 
    articles.find(a => a.slug === currentPath.selectedId), [currentPath.selectedId, articles]);

  const filteredCategories = categories.filter(c => c.audience === selectedAudience);
  
  const filteredSubcategories = useMemo(() => 
    topics.filter(s => s.categoryId === currentCategory?.id), [currentCategory, topics]);

  const filteredArticles = useMemo(() => 
    articles.filter(a => a.subcategory === currentSubcategory?.id && a.audience === selectedAudience), [currentSubcategory, selectedAudience, articles]);

  const searchResults = useMemo(() => {
    if (!currentPath.searchQuery) return [];
    const q = currentPath.searchQuery.toLowerCase();
    return articles.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
  }, [currentPath.searchQuery, articles]);

  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  }, [searchQuery, articles]);

  // Handlers
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPath({ view: 'search', searchQuery: searchQuery.trim() });
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Back navigation logic
  const handleBack = () => {
    if (currentPath.view === 'article') {
      setCurrentPath({ view: 'subcategory', selectedId: currentArticle?.subcategory });
    } else if (currentPath.view === 'subcategory') {
      setCurrentPath({ view: 'category', selectedId: currentSubcategory?.categoryId });
    } else if (currentPath.view === 'category' || currentPath.view === 'search') {
      setCurrentPath({ view: 'home' });
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Hero Section */}
      <section className="bg-[#f0fdfa] border-b border-teal-50 pt-32 pb-12 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-8 leading-tight">
            How can we help?
          </h1>
          
          <div className="relative max-w-2xl mx-auto" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search help articles..." 
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 shadow-xl shadow-gray-200/50 text-lg transition-all"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-teal-600 transition-colors" />
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60] text-left">
                {suggestions.length > 0 ? (
                  <div>
                    {suggestions.map(s => (
                      <button 
                        key={s.id}
                        onClick={() => {
                          setCurrentPath({ view: 'article', selectedId: s.slug });
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left"
                      >
                        <FileText className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span className="text-slate-800 font-medium">{s.title}</span>
                      </button>
                    ))}
                    <button 
                      onClick={() => handleSearch()}
                      className="w-full px-6 py-3 bg-slate-50 text-teal-600 text-sm font-semibold text-center hover:bg-teal-100 transition-colors"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="px-6 py-6 text-slate-400 text-center italic">
                    No results found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Search:</span>
            {['Escrow', 'Refunds', 'Verification'].map(tag => (
              <button 
                key={tag}
                onClick={() => { setSearchQuery(tag); setCurrentPath({ view: 'search', searchQuery: tag }); }}
                className="text-xs bg-white border border-slate-200 hover:border-teal-500 px-3 py-1 rounded-full text-gray-600 transition-all shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        
        {/* VIEW: HOME */}
        {currentPath.view === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Audience Tab Filter */}
            <div className="flex justify-center mb-16">
              <div className="bg-[#f0fdfa] border border-teal-100 p-2 rounded-2xl flex items-center shadow-sm">
                <button 
                  onClick={() => setSelectedAudience('creator')}
                  className={`w-40 md:w-56 py-4 rounded-xl text-base md:text-lg font-bold transition-all ${selectedAudience === 'creator' ? 'bg-white text-teal-700 shadow-md' : 'text-slate-500 hover:text-teal-600'}`}
                >
                  For Creators
                </button>
                <button 
                  onClick={() => setSelectedAudience('backer')}
                  className={`w-40 md:w-56 py-4 rounded-xl text-base md:text-lg font-bold transition-all ${selectedAudience === 'backer' ? 'bg-white text-teal-700 shadow-md' : 'text-slate-500 hover:text-teal-600'}`}
                >
                  For Backers
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-10">
              <div className="w-1.5 h-8 bg-teal-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Select a category</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map(cat => (
                <HierarchyCard 
                  key={cat.id}
                  label={cat.label}
                  description={cat.description}
                  icon={cat.icon}
                  count={topics.filter(s => s.categoryId === cat.id).length}
                  unit="Topic"
                  onClick={() => setCurrentPath({ view: 'category', selectedId: cat.id })}
                />
              ))}
            </div>

            {/* Popular Section */}
            <div className="mt-24 pt-10 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-10">
                <LayoutGrid className="w-6 h-6 text-teal-600" />
                <h2 className="text-3xl font-bold text-slate-900">Popular articles</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {articles.slice(0, 4).map(article => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    onClick={() => setCurrentPath({ view: 'article', selectedId: article.slug })}
                  />
                ))}
              </div>
            </div>

            {/* UPDATED SECTION: WIDER CONTACT CTA */}
            <div className="mt-32 max-w-5xl mx-auto pb-20">
              <div className="bg-primary rounded-[3rem] p-16 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20 group">
                {/* Background Watermark Icon */}
                <div className="absolute top-[-10%] right-[-10%] opacity-10 text-white transform rotate-12 transition-transform duration-1000 group-hover:rotate-0">
                  <LifeBuoy size={400} />
                </div>
                
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Still need help?</h2>
                  <p className="text-teal-50/80 mb-12 text-xl leading-relaxed max-w-2xl mx-auto">
                    Our support team is here to help you navigate your creator journey and answer any technical or account-related questions.
                  </p>
                  
                  <div className="space-y-4 max-w-sm mx-auto">
                    <button className="w-full py-5 bg-white text-primary font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      <MessageCircle size={22} /> Chat with us
                    </button>
                    <a 
                      href="mailto:support@sproux.ai"
                      className="w-full py-5 bg-[#0a524c] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-[#08453f] transition-all shadow-lg active:scale-[0.98]"
                    >
                      <LifeBuoy size={22} /> Contact Support
                    </a>
                  </div>
                  
                  <div className="mt-12 text-[11px] font-black uppercase tracking-[0.3em] text-teal-100/50">
                    Average Response time: ~2 hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: CATEGORY (Subcategory List) */}
        {currentPath.view === 'category' && currentCategory && (
          <div className="animate-in fade-in slide-in-from-right-6 duration-500">
             <button onClick={handleBack} className="flex items-center gap-2 text-teal-600 font-bold mb-10 hover:translate-x-[-4px] transition-transform">
                <ArrowLeft size={18} /> Back to Categories
             </button>
             <div className="flex items-center gap-3 mb-10">
                <div className="w-1.5 h-8 bg-teal-600 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">{currentCategory.label}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubcategories.map(sub => (
                  <HierarchyCard 
                    key={sub.id}
                    label={sub.label}
                    description={sub.description}
                    icon={sub.icon}
                    count={articles.filter(a => a.subcategory === sub.id).length}
                    unit="Article"
                    onClick={() => setCurrentPath({ view: 'subcategory', selectedId: sub.id })}
                  />
                ))}
              </div>
          </div>
        )}

        {/* VIEW: SUBCATEGORY (Article List) */}
        {currentPath.view === 'subcategory' && currentSubcategory && (
          <div className="animate-in fade-in slide-in-from-right-6 duration-500">
             <button onClick={handleBack} className="flex items-center gap-2 text-teal-600 font-bold mb-10 hover:translate-x-[-4px] transition-transform">
                <ArrowLeft size={18} /> Back to {categories.find(c => c.id === currentSubcategory.categoryId)?.label}
             </button>
             <div className="flex items-center gap-3 mb-10">
                <div className="w-1.5 h-8 bg-teal-600 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">{currentSubcategory.label}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    onClick={() => setCurrentPath({ view: 'article', selectedId: article.slug })}
                  />
                ))}
              </div>
          </div>
        )}

        {/* VIEW: ARTICLE DETAIL */}
        {currentPath.view === 'article' && currentArticle && (
          <div className="animate-in fade-in duration-500">
            <nav className="flex items-center text-sm text-slate-400 mb-8 font-medium">
              <button onClick={() => setCurrentPath({ view: 'home' })} className="hover:text-teal-600 transition-colors flex items-center gap-1.5">
                <Home size={14} /> Home
              </button>
              <ChevronRight size={14} className="mx-3 opacity-30" />
              <span className="capitalize">{currentArticle.audience} Center</span>
              <ChevronRight size={14} className="mx-3 opacity-30" />
              <span className="text-slate-900 truncate">{currentArticle.title}</span>
            </nav>

            <article className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                      <DynamicIcon name={currentArticle.icon} size={28} />
                    </div>
                    {currentArticle.isCritical && (
                      <span className="bg-teal-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                          Essential Reading
                      </span>
                    )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                  {currentArticle.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-10 pb-10 border-b border-slate-50">
                    <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{currentArticle.readingTime} minute read</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <span className="text-teal-600 font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full text-xs">
                        {topics.find(s => s.id === currentArticle.subcategory)?.label}
                    </span>
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <span>Updated {currentArticle.updatedAt}</span>
                </div>

                <div 
                  className="prose prose-teal prose-lg max-w-none text-slate-700 leading-relaxed font-normal"
                  dangerouslySetInnerHTML={{ __html: currentArticle.content }}
                />
              </div>

              <div className="bg-slate-50 border-t border-slate-100 p-10 text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-8">Was this article helpful?</h3>
                <div className="flex justify-center gap-4">
                  <button className="flex items-center gap-3 px-10 py-4 bg-white border border-slate-200 rounded-full text-slate-700 font-bold hover:border-teal-500 hover:text-teal-600 hover:shadow-lg transition-all active:scale-95 shadow-sm">
                    <ThumbsUp size={18} /> Yes
                  </button>
                  <button className="flex items-center gap-3 px-10 py-4 bg-white border border-slate-200 rounded-full text-slate-700 font-bold hover:border-red-400 hover:text-red-500 hover:shadow-lg transition-all active:scale-95 shadow-sm">
                    <ThumbsDown size={18} /> No
                  </button>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* VIEW: SEARCH RESULTS */}
        {currentPath.view === 'search' && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-10">
              <button onClick={handleBack} className="text-teal-600 flex items-center gap-2 text-sm font-bold hover:underline mb-6">
                <ArrowLeft size={16} /> Back to Home
              </button>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Search results for "{currentPath.searchQuery}"
              </h1>
              <p className="text-slate-500 mt-2 font-medium">{searchResults.length} articles found</p>
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map(article => (
                  <button 
                    key={article.id} 
                    onClick={() => setCurrentPath({ view: 'article', selectedId: article.slug })}
                    className="w-full text-left block bg-white p-8 rounded-2xl border border-slate-200 hover:border-teal-500 transition-all hover:shadow-xl group"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">{article.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">{article.description}</p>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span className="bg-slate-100 px-2 py-1 rounded">{article.audience}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span>{article.readingTime} min read</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No results found</h3>
                <p className="text-slate-500 mt-2">Try searching for something else or browse topics.</p>
                <button onClick={() => setCurrentPath({ view: 'home' })} className="mt-8 px-8 py-3 bg-teal-600 text-white rounded-full font-bold shadow-lg shadow-teal-100">Browse All Topics</button>
              </div>
            )}
          </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .prose h2 { font-family: 'Fraunces', serif; color: #0f172a; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem; }
        .prose p { margin-bottom: 1.25rem; font-size: 1.125rem; }
        .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .prose li { margin-bottom: 0.5rem; }
      `}} />
    </div>
  );
};

// --- SUBCOMPONENTS ---

const HierarchyCard: React.FC<any> = ({ label, description, icon, onClick, count, unit = 'Topic' }) => {
  return (
    <button 
      onClick={onClick}
      className="group text-left bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-teal-500 hover:shadow-2xl transition-all duration-300 flex flex-col h-full shadow-sm"
    >
      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center mb-6 transition-all transform group-hover:-translate-y-1">
        <DynamicIcon name={icon} size={28} />
      </div>
      <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors leading-tight">{label}</h3>
      <p className="text-slate-500 text-[15px] leading-relaxed mb-6 flex-grow">{description}</p>
      <div className="flex items-center justify-between pt-6 border-t border-slate-50 w-full mt-auto">
        <span className="text-xs font-black text-teal-600 uppercase tracking-[0.2em]">
          {count !== undefined ? `${count} ${count === 1 ? unit : unit + 's'}` : 'Explore'}
        </span>
        <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center text-slate-300 group-hover:text-teal-600 transition-all">
          <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </button>
  );
};

const ArticleCard: React.FC<{ article: Article; onClick: () => void }> = ({ article, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`group text-left block bg-white rounded-3xl border p-8 hover:shadow-2xl transition-all duration-300 h-full flex flex-col relative overflow-hidden
        ${article.isCritical ? 'border-teal-100 ring-4 ring-teal-50/50 shadow-md' : 'border-slate-100 hover:border-teal-500'}
      `}
    >
      {article.isCritical && (
        <div className="absolute top-0 right-0 bg-teal-600 text-white text-[9px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-[0.15em] shadow-sm z-10">
          Essential
        </div>
      )}
      
      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center mb-6 transition-all transform group-hover:-translate-y-1">
        <DynamicIcon name={article.icon} size={28} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
        {article.title}
      </h3>
      
      <p className="text-[14px] text-slate-500 mb-6 line-clamp-3 leading-relaxed flex-grow">
        {article.description}
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-slate-100 w-full mt-auto">
        <span className="text-xs font-black text-teal-600 uppercase tracking-widest group-hover:text-teal-700 transition-colors">
          {article.readingTime} min read
        </span>
        <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center text-slate-300 group-hover:text-teal-600 transition-all">
          <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </button>
  );
};

export default HelpDesk;
