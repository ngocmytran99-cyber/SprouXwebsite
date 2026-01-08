
import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle, ImageIcon, X, Upload } from 'lucide-react';

// Mock pages for the dropdowns
const MOCK_PAGES = [
  { id: '1', title: 'Home' },
  { id: '2', title: 'How It Works' },
  { id: '3', title: 'Pricing' },
  { id: '4', title: 'Blog' },
  { id: '5', title: 'Community' },
  { id: '6', title: 'Help Desk' },
  { id: '7', title: 'Privacy Policy' },
];

export type SettingsTab = 'general' | 'writing' | 'reading' | 'discussion' | 'media' | 'permalinks' | 'privacy';

interface SettingsProps {
  activeSubTab: SettingsTab;
  headerLogo: string;
  setHeaderLogo: (url: string) => void;
  footerLogo: string;
  setFooterLogo: (url: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ activeSubTab, headerLogo, setHeaderLogo, footerLogo, setFooterLogo }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showMailPassword, setShowMailPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerLogoInputRef = useRef<HTMLInputElement>(null);
  const footerLogoInputRef = useRef<HTMLInputElement>(null);

  // Centralized Settings State
  const [settings, setSettings] = useState({
    // General
    siteTitle: 'SprouX',
    tagline: 'Turn Knowledge into Financial Autonomy',
    siteIcon: '', 
    siteUrl: 'https://sproux.ai',
    adminEmail: 'admin@sproux.com',
    defaultRole: 'Administrator',
    language: 'English (United States)',
    timezone: 'UTC+7',

    // Writing
    defaultCategory: 'Uncategorized',
    defaultFormat: 'Standard',
    defaultEditor: 'classic', // classic | block
    allowEditorSwitch: false,
    mailServer: 'mail.example.com',
    mailPort: 110,
    mailLogin: 'login@example.com',
    mailPassword: '',
    mailCategory: 'Uncategorized',
    updateServices: 'https://rpc.pingomatic.com/',

    // Reading
    homepageDisplay: 'static' as 'posts' | 'static',
    pageOnFront: 'Home',
    pageForPosts: '— Select —',
    postsPerPage: 10,
    postsInFeed: 10,
    feedFullText: true,
    searchEngineVisibility: false,

    // Discussion
    notifyLinkedBlogs: false,
    allowPingbacks: false,
    allowComments: true,
    requireNameEmail: true,
    requireLogin: false,
    closeComments: false,
    closeCommentsDays: 14,
    showCookieOptIn: true,
    threadComments: true,
    threadLevels: 5,
    pageComments: false,
    commentsPerPage: 50,
    defaultCommentPage: 'last',
    commentOrder: 'older',
    emailOnComment: true,
    emailOnModeration: true,
    moderationManualApprove: false,
    moderationPreviousApproved: true,
    moderationLinkCount: 2,
    moderationKeys: '',
    disallowedKeys: '',
    showAvatars: true,
    avatarRating: 'g',
    defaultAvatar: 'mp',

    // Media
    thumbWidth: 150,
    thumbHeight: 150,
    thumbCrop: true,
    medWidth: 300,
    medHeight: 300,
    largeWidth: 1024,
    largeHeight: 1024,
    organizeUploads: true,

    // Permalinks
    permalinkStructure: 'postname',
    customPermalink: '/%postname%/',
    categoryBase: '',
    tagBase: '',

    // Privacy
    privacyPageId: '7'
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    if (saveSuccess) setSaveSuccess(false);
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('siteIcon', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate Backend Call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    console.log("Saving settings to database...", settings);
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Auto-hide success message
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const renderSaveButton = () => (
    <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
      <button 
        type="submit"
        disabled={isSaving}
        className="px-6 py-2 bg-[#2271b1] text-white text-[13px] font-bold rounded shadow-sm hover:bg-[#135e96] transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
        Save Changes
      </button>
      {saveSuccess && (
        <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold animate-in fade-in slide-in-from-left-2">
          <CheckCircle size={14} /> Settings saved successfully.
        </div>
      )}
    </div>
  );

  const inputClasses = "p-1.5 border border-slate-300 rounded-sm bg-white text-slate-900 text-sm focus:border-blue-500 outline-none transition-colors shadow-inner";
  const selectClasses = "p-1.5 border border-slate-300 rounded-sm bg-white text-slate-900 text-sm focus:border-blue-500 outline-none transition-colors cursor-pointer";
  const labelClasses = "text-[13px] font-bold text-slate-700 uppercase tracking-tight";
  const subLabelClasses = "text-[13px] text-slate-700 font-medium";

  const renderContent = () => {
    switch (activeSubTab) {
      case 'writing':
        return (
          <form onSubmit={handleSave} className="max-w-7xl mx-auto space-y-4 animate-in fade-in">
            <h1 className="text-xl font-medium text-slate-800">Writing Settings</h1>
            <div className="bg-white border border-slate-300 shadow-sm p-8 space-y-8 text-slate-900">
               <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <label className={labelClasses}>Default Post Category</label>
                  <div className="md:col-span-3">
                     <select 
                      value={settings.defaultCategory}
                      onChange={e => handleChange('defaultCategory', e.target.value)}
                      className={selectClasses + " w-full max-w-[200px]"}
                     >
                        <option>Uncategorized</option>
                        <option>Technology</option>
                        <option>Tutorial</option>
                        <option>AI & Machine Learning</option>
                        <option>Business</option>
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <label className={labelClasses}>Default Post Format</label>
                  <div className="md:col-span-3">
                     <select 
                      value={settings.defaultFormat}
                      onChange={e => handleChange('defaultFormat', e.target.value)}
                      className={selectClasses + " w-full max-w-[200px]"}
                     >
                        <option>Standard</option>
                        <option>Aside</option>
                        <option>Chat</option>
                        <option>Gallery</option>
                        <option>Link</option>
                        <option>Image</option>
                        <option>Quote</option>
                        <option>Status</option>
                        <option>Video</option>
                        <option>Audio</option>
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-2">
                  <label className={labelClasses + " mt-0.5"}>Default editor for all users</label>
                  <div className="md:col-span-3 space-y-2">
                     <label className="flex items-center space-x-2 text-[13px] text-slate-900 cursor-pointer">
                        <input type="radio" checked={settings.defaultEditor === 'classic'} onChange={() => handleChange('defaultEditor', 'classic')} className="text-blue-600 focus:ring-0 w-4 h-4" />
                        <span>Classic editor</span>
                     </label>
                     <label className="flex items-center space-x-2 text-[13px] text-slate-900 cursor-pointer">
                        <input type="radio" checked={settings.defaultEditor === 'block'} onChange={() => handleChange('defaultEditor', 'block')} className="text-blue-600 focus:ring-0 w-4 h-4" />
                        <span>Block editor</span>
                     </label>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-2">
                  <label className={labelClasses + " mt-0.5"}>Allow users to switch editors</label>
                  <div className="md:col-span-3 space-y-2">
                     <label className="flex items-center space-x-2 text-[13px] text-slate-900 cursor-pointer">
                        <input type="radio" checked={settings.allowEditorSwitch === true} onChange={() => handleChange('allowEditorSwitch', true)} className="text-blue-600 focus:ring-0 w-4 h-4" />
                        <span>Yes</span>
                     </label>
                     <label className="flex items-center space-x-2 text-[13px] text-slate-900 cursor-pointer">
                        <input type="radio" checked={settings.allowEditorSwitch === false} onChange={() => handleChange('allowEditorSwitch', false)} className="text-blue-600 focus:ring-0 w-4 h-4" />
                        <span>No</span>
                     </label>
                  </div>
               </div>

               <div className="pt-6 border-t border-slate-100 space-y-6">
                  <h3 className="text-base font-bold text-slate-800">Post via email</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                     <label className={labelClasses}>Mail Server</label>
                     <div className="md:col-span-3 flex items-center space-x-2">
                        <input type="text" value={settings.mailServer} onChange={e => handleChange('mailServer', e.target.value)} placeholder="mail.example.com" className={inputClasses + " flex-1 max-w-sm"} />
                        <label className={labelClasses + " px-2"}>Port</label>
                        <input type="number" value={settings.mailPort} onChange={e => handleChange('mailPort', parseInt(e.target.value))} className={inputClasses + " w-20"} />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                     <label className={labelClasses}>Login Name</label>
                     <div className="md:col-span-3">
                        <input type="text" value={settings.mailLogin} onChange={e => handleChange('mailLogin', e.target.value)} placeholder="login@example.com" className={inputClasses + " w-full max-w-sm"} />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                     <label className={labelClasses}>Password</label>
                     <div className="md:col-span-3 relative max-w-sm">
                        <input type={showMailPassword ? 'text' : 'password'} value={settings.mailPassword} onChange={e => handleChange('mailPassword', e.target.value)} className={inputClasses + " w-full pr-10"} />
                        <button type="button" onClick={() => setShowMailPassword(!showMailPassword)} className="absolute right-2 top-1.5 text-slate-500 hover:text-slate-700">
                           {showMailPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                     </div>
                  </div>
               </div>

               <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h3 className="text-base font-bold text-slate-800">Update Services</h3>
                  <textarea value={settings.updateServices} onChange={e => handleChange('updateServices', e.target.value)} className="w-full h-24 p-2 border border-slate-300 rounded-sm bg-white text-slate-900 focus:border-blue-500 outline-none text-[13px] font-mono leading-relaxed shadow-inner" />
               </div>

               {renderSaveButton()}
            </div>
          </form>
        );
      case 'reading':
        return (
          <form onSubmit={handleSave} className="max-w-7xl mx-auto space-y-4 animate-in fade-in">
            <h1 className="text-xl font-medium text-slate-800">Reading Settings</h1>
            <div className="bg-white border border-slate-300 shadow-sm p-8 space-y-8 text-slate-900">
               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-2">
                  <label className={labelClasses + " mt-0.5"}>Your homepage displays</label>
                  <div className="md:col-span-3 space-y-3">
                     <label className="flex items-center space-x-2 text-[13px] text-slate-900 cursor-pointer">
                        <input type="radio" checked={settings.homepageDisplay === 'posts'} onChange={() => handleChange('homepageDisplay', 'posts')} className="text-blue-600 focus:ring-0 w-4 h-4" />
                        <span>Your latest posts</span>
                     </label>
                     <div className="space-y-4">
                        <label className="flex items-center space-x-2 text-[13px] text-slate-900 cursor-pointer">
                           <input type="radio" checked={settings.homepageDisplay === 'static'} onChange={() => handleChange('homepageDisplay', 'static')} className="text-blue-600 focus:ring-0 w-4 h-4" />
                           <span>A static page (select below)</span>
                        </label>
                        {settings.homepageDisplay === 'static' && (
                           <div className="ml-6 space-y-4 pt-2 pl-4 border-l-2 border-slate-100">
                              <div className="flex items-center space-x-4">
                                 <label className="text-[13px] w-24 text-slate-700">Homepage:</label>
                                 <select value={settings.pageOnFront} onChange={e => handleChange('pageOnFront', e.target.value)} className={selectClasses + " w-full max-w-[240px]"}>
                                    {MOCK_PAGES.map(page => <option key={page.id} value={page.title}>{page.title}</option>)}
                                 </select>
                              </div>
                              <div className="flex items-center space-x-4">
                                 <label className="text-[13px] w-24 text-slate-700">Posts page:</label>
                                 <select value={settings.pageForPosts} onChange={e => handleChange('pageForPosts', e.target.value)} className={selectClasses + " w-full max-w-[240px]"}>
                                    <option>— Select —</option>
                                    {MOCK_PAGES.map(page => <option key={page.id} value={page.title}>{page.title}</option>)}
                                 </select>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pt-2">
                  <label className={labelClasses}>Blog pages show at most</label>
                  <div className="md:col-span-3 flex items-center space-x-3">
                     <input type="number" value={settings.postsPerPage} onChange={e => handleChange('postsPerPage', parseInt(e.target.value))} className={inputClasses + " w-16 text-center"} />
                     <span className="text-[13px] text-slate-700">posts</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-2">
                  <label className={labelClasses + " mt-0.5"}>For each post in a feed, include</label>
                  <div className="md:col-span-3 space-y-2">
                     <label className="flex items-center space-x-2 text-[13px] text-slate-900 cursor-pointer">
                        <input type="radio" checked={settings.feedFullText === true} onChange={() => handleChange('feedFullText', true)} className="text-blue-600 focus:ring-0 w-4 h-4" />
                        <span>Full text</span>
                     </label>
                     <label className="flex items-center space-x-2 text-[13px] text-slate-900 cursor-pointer">
                        <input type="radio" checked={settings.feedFullText === false} onChange={() => handleChange('feedFullText', false)} className="text-blue-600 focus:ring-0 w-4 h-4" />
                        <span>Excerpt</span>
                     </label>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-2">
                  <label className={labelClasses + " mt-0.5"}>Search engine visibility</label>
                  <div className="md:col-span-3 space-y-2">
                     <label className="flex items-center space-x-2 text-[13px] text-slate-900 cursor-pointer">
                        <input type="checkbox" checked={settings.searchEngineVisibility} onChange={e => handleChange('searchEngineVisibility', e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4" />
                        <span>Discourage search engines from indexing this site</span>
                     </label>
                  </div>
               </div>
               {renderSaveButton()}
            </div>
          </form>
        );
      case 'discussion':
        return (
          <form onSubmit={handleSave} className="max-w-7xl mx-auto space-y-4 animate-in fade-in">
            <h1 className="text-xl font-medium text-slate-800">Discussion Settings</h1>
            <div className="bg-white border border-slate-300 shadow-sm p-8 space-y-8 text-slate-900">
               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                  <label className={labelClasses}>Default post settings</label>
                  <div className="md:col-span-3 space-y-2">
                     <label className="flex items-start space-x-2 text-[13px] text-slate-900 cursor-pointer">
                        <input type="checkbox" checked={settings.allowComments} onChange={e => handleChange('allowComments', e.target.checked)} className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4" />
                        <span>Allow people to submit comments on new posts</span>
                     </label>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-4 border-t border-slate-100">
                  <label className={labelClasses}>Other comment settings</label>
                  <div className="md:col-span-3 space-y-3">
                     <label className="flex items-center space-x-2 text-[13px] text-slate-900 cursor-pointer">
                        <input type="checkbox" checked={settings.requireNameEmail} onChange={e => handleChange('requireNameEmail', e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4" />
                        <span>Comment author must fill out name and email</span>
                     </label>
                     <label className="flex items-center space-x-2 text-[13px] text-slate-900 cursor-pointer">
                        <input type="checkbox" checked={settings.requireLogin} onChange={e => handleChange('requireLogin', e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4" />
                        <span>Users must be registered and logged in to comment</span>
                     </label>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-4 border-t border-slate-100">
                  <label className={labelClasses}>Moderation</label>
                  <div className="md:col-span-3 space-y-4">
                     <textarea value={settings.moderationKeys} onChange={e => handleChange('moderationKeys', e.target.value)} className="w-full h-32 p-3 border border-slate-300 rounded-sm bg-white text-slate-900 focus:border-blue-500 outline-none text-sm shadow-inner" placeholder="One word or IP per line"></textarea>
                  </div>
               </div>
               {renderSaveButton()}
            </div>
          </form>
        );
      case 'media':
        return (
          <form onSubmit={handleSave} className="max-w-7xl mx-auto space-y-4 animate-in fade-in">
            <h1 className="text-xl font-medium text-slate-800">Media Settings</h1>
            <div className="bg-white border border-slate-300 shadow-sm p-8 space-y-10 text-slate-900">
               <section className="space-y-6">
                  <h2 className="text-lg font-bold text-slate-800">Image sizes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                     <label className={labelClasses}>Thumbnail size</label>
                     <div className="md:col-span-3 space-y-3">
                        <div className="flex items-center space-x-4">
                           <span className={`${subLabelClasses} w-16`}>Width</span>
                           <input type="number" value={settings.thumbWidth} onChange={e => handleChange('thumbWidth', parseInt(e.target.value))} className={`${inputClasses} w-20 text-center font-bold`} />
                        </div>
                        <div className="flex items-center space-x-4">
                           <span className={`${subLabelClasses} w-16`}>Height</span>
                           <input type="number" value={settings.thumbHeight} onChange={e => handleChange('thumbHeight', parseInt(e.target.value))} className={`${inputClasses} w-20 text-center font-bold`} />
                        </div>
                     </div>
                  </div>
               </section>
               <section className="space-y-6 pt-8 border-t border-slate-200">
                  <div className="md:grid md:grid-cols-4 items-start gap-4">
                    <div className="md:col-start-2 md:col-span-3">
                        <label className="flex items-center space-x-2 text-[13px] text-slate-900 cursor-pointer font-medium">
                           <input type="checkbox" checked={settings.organizeUploads} onChange={e => handleChange('organizeUploads', e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4" />
                           <span>Organize my uploads into month- and year-based folders</span>
                        </label>
                    </div>
                  </div>
               </section>
               {renderSaveButton()}
            </div>
          </form>
        );
      case 'permalinks':
        return (
          <form onSubmit={handleSave} className="max-w-7xl mx-auto space-y-6 animate-in fade-in">
            <h1 className="text-xl font-medium text-slate-800">Permalink Settings</h1>
            <div className="bg-white border border-slate-300 shadow-sm p-8 space-y-12 text-slate-900">
               <section className="space-y-6">
                  <h2 className="text-lg font-bold text-slate-800">Common Settings</h2>
                  <div className="space-y-4">
                     {[
                        { id: 'plain', name: 'Plain', example: 'https://sproux.ai/?p=123' },
                        { id: 'dayname', name: 'Day and name', example: 'https://sproux.ai/2026/01/05/sample-post/' },
                        { id: 'postname', name: 'Post name', example: 'https://sproux.ai/sample-post/' },
                     ].map((item) => (
                        <div key={item.id} className="flex items-start space-x-3">
                           <input type="radio" checked={settings.permalinkStructure === item.id} onChange={() => handleChange('permalinkStructure', item.id)} className="mt-1 text-blue-600 focus:ring-0 w-4 h-4" />
                           <label className="cursor-pointer space-y-1">
                              <span className="text-[13px] font-bold text-slate-700">{item.name}</span>
                              <div className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[12px] font-mono text-slate-500 w-fit">{item.example}</div>
                           </label>
                        </div>
                     ))}
                  </div>
               </section>
               {renderSaveButton()}
            </div>
          </form>
        );
      case 'privacy':
        return (
          <form onSubmit={handleSave} className="max-w-7xl mx-auto space-y-6 animate-in fade-in">
            <h1 className="text-xl font-medium text-slate-800">Privacy Settings</h1>
            <div className="bg-white border border-slate-300 shadow-sm p-8 space-y-6 text-slate-900">
               <div className="border-t border-slate-200 pt-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                     <label className={labelClasses}>Change your Privacy Policy page</label>
                     <div className="md:col-span-3 flex items-center space-x-3">
                        <select value={settings.privacyPageId} onChange={e => handleChange('privacyPageId', e.target.value)} className={`${selectClasses} min-w-[240px]`}>
                           <option>— Select —</option>
                           {MOCK_PAGES.map(page => <option key={page.id} value={page.id}>{page.title}</option>)}
                        </select>
                     </div>
                  </div>
               </div>
               {renderSaveButton()}
            </div>
          </form>
        );
      default: // General
        return (
          <form onSubmit={handleSave} className="max-w-7xl mx-auto space-y-4 animate-in fade-in">
            <h1 className="text-xl font-medium text-slate-800">General Settings</h1>
            <div className="bg-white border border-slate-300 shadow-sm p-8 space-y-10 text-slate-900">
               <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <label className={labelClasses}>Site Title</label>
                  <div className="md:col-span-3">
                     <input type="text" value={settings.siteTitle} onChange={e => handleChange('siteTitle', e.target.value)} className={inputClasses + " w-full max-w-lg"} />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                  <label className={labelClasses}>Tagline</label>
                  <div className="md:col-span-3">
                     <input type="text" value={settings.tagline} onChange={e => handleChange('tagline', e.target.value)} className={inputClasses + " w-full max-w-lg"} />
                  </div>
               </div>

               {/* SEPARATED LOGO SECTION */}
               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-4 border-t border-slate-100">
                  <label className={labelClasses}>Header Logo</label>
                  <div className="md:col-span-3 space-y-4">
                     <input 
                       type="file" 
                       className="hidden" 
                       ref={headerLogoInputRef} 
                       accept="image/*"
                       onChange={(e) => handleFileUpload(e, setHeaderLogo)} 
                     />
                     
                     {headerLogo ? (
                        <div className="flex flex-col items-start gap-3">
                           <div className="relative group max-w-sm bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex items-center justify-center overflow-hidden">
                              <img src={headerLogo} className="max-h-12 w-auto object-contain" alt="Header Logo" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                  type="button" 
                                  onClick={() => setHeaderLogo('')}
                                  className="bg-white/90 text-red-600 p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                                >
                                  <X size={14} strokeWidth={3} />
                                </button>
                              </div>
                           </div>
                           <button type="button" onClick={() => headerLogoInputRef.current?.click()} className="px-3 py-1.5 bg-white border border-slate-300 text-[#2271b1] text-[11px] font-bold rounded shadow-sm hover:bg-slate-50 transition-colors">Change Image</button>
                        </div>
                     ) : (
                        <button type="button" onClick={() => headerLogoInputRef.current?.click()} className="px-6 py-2 bg-white border border-[#2271b1] text-[#2271b1] text-[12px] font-bold rounded shadow-sm hover:bg-blue-50 transition-all border-dashed hover:border-solid">Upload Header Logo</button>
                     )}
                     <p className="text-[11px] text-slate-400">Best for light backgrounds. Recommended: Transparent PNG/SVG, 40px height.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-4 border-t border-slate-100">
                  <label className={labelClasses}>Footer Logo</label>
                  <div className="md:col-span-3 space-y-4">
                     <input 
                       type="file" 
                       className="hidden" 
                       ref={footerLogoInputRef} 
                       accept="image/*"
                       onChange={(e) => handleFileUpload(e, setFooterLogo)} 
                     />
                     
                     {footerLogo ? (
                        <div className="flex flex-col items-start gap-3">
                           <div className="relative group max-w-sm bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-sm flex items-center justify-center overflow-hidden">
                              <img src={footerLogo} className="max-h-12 w-auto object-contain" alt="Footer Logo" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                  type="button" 
                                  onClick={() => setFooterLogo('')}
                                  className="bg-white/90 text-red-600 p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                                >
                                  <X size={14} strokeWidth={3} />
                                </button>
                              </div>
                           </div>
                           <button type="button" onClick={() => footerLogoInputRef.current?.click()} className="px-3 py-1.5 bg-white border border-slate-300 text-[#2271b1] text-[11px] font-bold rounded shadow-sm hover:bg-slate-50 transition-colors">Change Image</button>
                        </div>
                     ) : (
                        <button type="button" onClick={() => footerLogoInputRef.current?.click()} className="px-6 py-2 bg-white border border-[#2271b1] text-[#2271b1] text-[12px] font-bold rounded shadow-sm hover:bg-blue-50 transition-all border-dashed hover:border-solid">Upload Footer Logo</button>
                     )}
                     <p className="text-[11px] text-slate-400">Best for dark backgrounds. Recommended: White/Light PNG/SVG, 40px height.</p>
                  </div>
               </div>

               {/* SITE ICON SECTION */}
               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-4 border-t border-slate-100">
                  <label className={labelClasses}>Site Icon (Favicon)</label>
                  <div className="md:col-span-3 space-y-5">
                     <input 
                       type="file" 
                       className="hidden" 
                       ref={fileInputRef} 
                       accept="image/*"
                       onChange={handleIconUpload} 
                     />
                     
                     {settings.siteIcon ? (
                        <div className="flex flex-col items-start gap-4">
                           <div className="relative group w-24 h-24 bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex items-center justify-center overflow-hidden">
                              <img src={settings.siteIcon} className="max-w-full max-h-full object-contain" alt="Site Icon" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                  type="button" 
                                  onClick={() => handleChange('siteIcon', '')}
                                  className="bg-white/90 text-red-600 p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                                  title="Remove Icon"
                                >
                                  <X size={14} strokeWidth={3} />
                                </button>
                              </div>
                           </div>
                           <button 
                             type="button" 
                             onClick={() => fileInputRef.current?.click()}
                             className="px-4 py-2 bg-white border border-slate-300 text-[#2271b1] text-[13px] font-medium rounded shadow-sm hover:bg-slate-50 transition-colors"
                           >
                             Change Site Icon
                           </button>
                        </div>
                     ) : (
                        <div className="flex flex-col items-start">
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-10 py-3 bg-white border border-[#2271b1] text-[#2271b1] text-[14px] font-medium rounded shadow-sm hover:bg-blue-50 transition-all border-dashed hover:border-solid active:scale-[0.99]"
                          >
                            Choose a Site Icon
                          </button>
                        </div>
                     )}
                     
                     <p className="text-[13px] text-slate-500 max-w-2xl leading-relaxed">
                       The Site Icon is what you see in browser tabs, bookmark bars, and within mobile apps. It should be square and at least <span className="bg-[#f0f0f1] px-1.5 py-0.5 rounded text-slate-700">512 by 512</span> pixels.
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                  <label className={labelClasses}>Site Address (URL)</label>
                  <div className="md:col-span-3">
                     <input type="text" value={settings.siteUrl} onChange={e => handleChange('siteUrl', e.target.value)} className={inputClasses + " w-full max-w-lg"} />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                  <label className={labelClasses}>Administration Email</label>
                  <div className="md:col-span-3">
                     <input type="email" value={settings.adminEmail} onChange={e => handleChange('adminEmail', e.target.value)} className={inputClasses + " w-full max-w-lg"} />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <label className={labelClasses}>New User Default Role</label>
                  <div className="md:col-span-3">
                     <select value={settings.defaultRole} onChange={e => handleChange('defaultRole', e.target.value)} className={selectClasses + " w-full max-w-[200px]"}>
                        <option>Subscriber</option>
                        <option>Contributor</option>
                        <option>Author</option>
                        <option>Editor</option>
                        <option>Administrator</option>
                     </select>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-2">
                  <label className={labelClasses}>Site Language</label>
                  <div className="md:col-span-3 space-y-2">
                     <select value={settings.language} onChange={e => handleChange('language', e.target.value)} className={selectClasses + " w-full max-w-xs"}>
                        <option>English (United States)</option>
                        <option>Tiếng Việt</option>
                     </select>
                  </div>
               </div>
               {renderSaveButton()}
            </div>
          </form>
        );
    }
  };

  return (
    <div className="pb-12">
      {renderContent()}
    </div>
  );
};

export default Settings;
