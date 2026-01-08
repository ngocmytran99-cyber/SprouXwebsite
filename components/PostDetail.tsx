
import React, { useEffect } from 'react';
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark } from 'lucide-react';
import { BlogPost } from '../types';

interface PostDetailProps {
  post: BlogPost | Partial<BlogPost>;
  onBack: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm mb-12 transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Articles
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
              Knowledge Base
            </span>
            {post.status === 'draft' && (
              <span className="px-3 py-1 bg-amber/10 text-amber text-[10px] font-black uppercase tracking-widest rounded-full border border-amber/20 italic">
                Preview Mode
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight mb-8">
            {post.title || 'Untitled Post'}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                {post.author ? post.author.charAt(0) : 'A'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{post.author || 'Anonymous'}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.publishedAt || 'Not published'}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> 6 min read</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                <Share2 size={18} />
              </button>
              <button className="p-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                <Bookmark size={18} />
              </button>
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 aspect-video relative">
            <img 
              src={post.coverImage} 
              className="w-full h-full object-cover" 
              alt={post.title} 
            />
          </div>
        )}

        <div 
          className="visual-editor-content prose prose-slate max-w-none prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: post.content || '<p>No content available.</p>' }}
        />

        <footer className="mt-20 pt-12 border-t border-slate-100">
          <div className="bg-slate-50 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-slate-100">
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl font-serif font-bold text-slate-900 mb-3">Ready to scale your influence?</h4>
              <p className="text-slate-600 font-medium leading-relaxed">
                Join SprouX today and transform your knowledge into market-ready digital products. No technical setup required.
              </p>
            </div>
            <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-teal-800 transition-all">
              Start Your Free Trial
            </button>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .visual-editor-content { line-height: 1.8; font-size: 1.125rem; color: #334155; }
        .visual-editor-content h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1.5rem; margin-top: 3rem; color: #0f172a; line-height: 1.2; }
        .visual-editor-content h2 { font-size: 1.875rem; font-weight: 700; margin-bottom: 1.25rem; margin-top: 2.5rem; color: #1e293b; line-height: 1.3; }
        .visual-editor-content h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; margin-top: 2rem; color: #334155; }
        .visual-editor-content p { margin-bottom: 1.5rem; }
        .visual-editor-content blockquote { border-left: 4px solid #0f766e; padding-left: 1.5rem; font-style: italic; color: #475569; margin: 2rem 0; font-size: 1.25rem; }
        .visual-editor-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .visual-editor-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .visual-editor-content img { max-width: 100%; height: auto; border-radius: 1.5rem; margin: 3rem auto; display: block; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
        .visual-editor-content a { color: #0f766e; text-decoration: underline; font-weight: 600; }
      `}} />
    </div>
  );
};

export default PostDetail;
