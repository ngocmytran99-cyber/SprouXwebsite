
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Clock, User, ChevronRight, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { ViewType } from '../App';
import { BlogPost, Category } from '../types';

interface BlogProps {
  onNavigate: (view: ViewType) => void;
  posts: BlogPost[];
  categories: Category[];
  onSelectPost?: (post: BlogPost) => void;
}

const Blog: React.FC<BlogProps> = ({ onNavigate, posts, categories, onSelectPost }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  // Lọc bài viết theo tìm kiếm
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [posts, searchQuery]);

  // Nhóm bài viết theo category
  const groupedData = useMemo(() => {
    return categories.map(cat => {
      const catPosts = filteredPosts.filter(p => p.categoryIds.includes(cat.id));
      return {
        category: cat,
        posts: catPosts
      };
    }).filter(group => group.posts.length > 0); // Chỉ hiện topic có bài viết
  }, [categories, filteredPosts]);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-6">
              Knowledge <span className="gradient-text">Drops</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              Deep dives into creator strategy, product validation, and the future of independent work.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
             />
          </div>
        </div>

        {groupedData.length > 0 ? (
          <div className="space-y-24">
            {groupedData.map((group) => {
              const isExpanded = expandedTopics[group.category.id];
              const displayPosts = isExpanded ? group.posts : group.posts.slice(0, 3);
              const hasMore = group.posts.length > 3;

              return (
                <section key={group.category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900">{group.category.name}</h2>
                      </div>
                      <p className="text-slate-500 font-medium text-sm">{group.category.description}</p>
                    </div>
                    {hasMore && (
                      <button 
                        onClick={() => toggleTopic(group.category.id)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 font-bold text-sm hover:bg-white hover:border-primary hover:text-primary transition-all shadow-sm"
                      >
                        {isExpanded ? (
                          <>Show less <ChevronUp size={16}/></>
                        ) : (
                          <>View all {group.posts.length} articles <ChevronDown size={16}/></>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayPosts.map(post => (
                      <div 
                        key={post.id} 
                        className="group flex flex-col cursor-pointer bg-white" 
                        onClick={() => onSelectPost?.(post)}
                      >
                        <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-6 border border-slate-100 shadow-sm relative">
                           <img src={post.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} />
                           <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-widest rounded-lg">Article</div>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 mb-6 flex-1 line-clamp-3 text-sm leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                           <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                              <Clock size={14} /> {post.publishedAt}
                           </div>
                           <span className="flex items-center gap-1 text-primary font-bold text-sm">Read Article <ChevronRight size={16}/></span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {hasMore && !isExpanded && (
                    <div className="mt-12 flex justify-center">
                      <button 
                        onClick={() => toggleTopic(group.category.id)}
                        className="text-slate-400 font-bold text-sm hover:text-primary transition-colors flex items-center gap-2"
                      >
                        And {group.posts.length - 3} more articles in this topic <ChevronDown size={14}/>
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Search size={48} className="mx-auto text-slate-200 mb-6" />
            <h2 className="text-2xl font-serif font-bold text-slate-400">No articles found matching "{searchQuery}"</h2>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-teal-800 transition-all shadow-lg shadow-primary/20"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
