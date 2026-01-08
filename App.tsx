
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import WhySprouX from './components/WhySprouX';
import CreatorsGrid from './components/CreatorsGrid';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Pricing from './components/Pricing';
import HowItWorks from './components/HowItWorks';
import HelpDesk from './components/HelpDesk';
import CMS from './components/Admin/CMS';
import Blog from './components/Blog';
import PostDetail from './components/PostDetail';
import Login from './components/Admin/Login';
import { FileQuestion, Home } from 'lucide-react';
import { User, BlogPost, Category, MediaAttachment, PageData, HelpDeskCategory, HelpDeskTopic, HelpDeskArticle } from './types';

export type ViewType = 'home' | 'pricing' | 'how-it-works' | 'help-desk' | 'admin' | 'blog' | 'admin-login' | 'post-detail';

const NotFound: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
      <FileQuestion size={40} />
    </div>
    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Page Not Found</h1>
    <p className="text-slate-500 mb-8 text-center max-w-sm">
      The page you're looking for doesn't exist or is currently unavailable.
    </p>
    <button 
      onClick={onBack}
      className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-teal-800 transition-all"
    >
      <Home size={18} /> Back to Home
    </button>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | Partial<BlogPost> | null>(null);
  
  // Separate Global Site Logos
  const [headerLogo, setHeaderLogo] = useState<string>('');
  const [footerLogo, setFooterLogo] = useState<string>('');
  
  // Set initial state to null to require login for CMS
  const [user, setUser] = useState<User | null>(null);

  // Users Management State (Mock initial list)
  const [users, setUsers] = useState<User[]>([
    {
      id: 'admin-01',
      email: 'admin@sproux.com',
      name: 'SprouX Admin',
      role: 'administrator',
      password: 'admin123',
      lastLogin: 'Today, 10:45 AM'
    },
    {
      id: 'editor-01',
      email: 'editor@sproux.com',
      name: 'Sarah Editor',
      role: 'editor',
      password: 'editorpassword',
      lastLogin: 'Yesterday, 4:20 PM'
    }
  ]);

  // --- CMS Persistent State (To remember where user was) ---
  const [cmsTab, setCmsTab] = useState<'dashboard' | 'posts' | 'pages' | 'media' | 'settings' | 'helpdesk' | 'users'>('dashboard');
  const [cmsPostsSubTab, setCmsPostsSubTab] = useState<'all' | 'add' | 'categories'>('all');
  const [cmsIsEditorOpen, setCmsIsEditorOpen] = useState(false);
  const [cmsEditingPost, setCmsEditingPost] = useState<Partial<BlogPost> | null>(null);

  // Help Desk CMS State
  const [hdCategories, setHdCategories] = useState<HelpDeskCategory[]>([
    { id: 'start', label: 'Start as a Creator', description: 'Everything you need to know about starting your journey on SprouX.', icon: 'Zap', audience: 'creator' },
    { id: 'launch', label: 'Launch & Run Your Campaign', description: 'Strategies for structuring rewards and managing a live campaign.', icon: 'Rocket', audience: 'creator' },
    { id: 'deliver', label: 'Deliver & Get Paid', description: 'The core mechanics of escrow, verification, and payouts.', icon: 'ShieldCheck', audience: 'creator' },
    { id: 'trust', label: 'Trust & Disputes', description: 'How we handle conflicts and protect our community members.', icon: 'Scale', audience: 'creator' },
    { id: 'account', label: 'Account & Access', description: 'Manage your profile, security, and notification preferences.', icon: 'User', audience: 'creator' },
    { id: 'backer-basics', label: 'Backer Basics', description: 'Supporting projects and receiving your rewards safely.', icon: 'Heart', audience: 'backer' },
    { id: 'backer-trust', label: 'Safety & Protection', description: 'How SprouX protects your funds and ensures delivery.', icon: 'Lock', audience: 'backer' }
  ]);

  const [hdTopics, setHdTopics] = useState<HelpDeskTopic[]>([
    { id: 'basics', categoryId: 'start', label: 'Platform Basics', description: 'What is SprouX and how it works.', icon: 'Info' },
    { id: 'refinement', categoryId: 'start', label: 'Idea Refinement', description: 'Polishing your concept with feedback.', icon: 'PenTool' },
    { id: 'planning', categoryId: 'launch', label: 'Campaign Planning', description: 'Setting goals and timelines.', icon: 'Calendar' },
    { id: 'rewards', categoryId: 'launch', label: 'Rewards & Pricing', description: 'Early-bird tiers and reward structure.', icon: 'Tag' },
    { id: 'escrow', categoryId: 'deliver', label: 'Escrow System', description: 'Understanding the 30/60/10 split.', icon: 'Shield' },
    { id: 'payouts', categoryId: 'deliver', label: 'Payout Process', description: 'How and when you receive your funds.', icon: 'DollarSign' },
    { id: 'verification', categoryId: 'deliver', label: 'Verification', description: 'The 80% rule and proof of delivery.', icon: 'UserCheck' },
    { id: 'disputes', categoryId: 'trust', label: 'Dispute Handling', description: 'Mediation and resolution steps.', icon: 'Gavel' },
    { id: 'safety', categoryId: 'trust', label: 'Trust Philosophy', description: 'Why we use escrow to protect everyone.', icon: 'Activity' },
    { id: 'profile', categoryId: 'account', label: 'Profile Settings', description: 'Managing personal and payment info.', icon: 'Settings' },
    { id: 'pledging', categoryId: 'backer-basics', label: 'Pledging', description: 'Supporting creators financially.', icon: 'CreditCard' },
    { id: 'tracking', categoryId: 'backer-basics', label: 'Tracking Rewards', description: 'What happens after you pledge.', icon: 'Package' },
    { id: 'protection', categoryId: 'backer-trust', label: 'Buyer Protection', description: 'Escrow and dispute rights for backers.', icon: 'ShieldAlert' }
  ]);

  const [hdArticles, setHdArticles] = useState<HelpDeskArticle[]>([
    {
      id: 1,
      slug: 'what-is-sproux',
      title: 'What is SprouX and who is it for?',
      description: 'An overview of the platform, its mission, and the types of creators best suited for our ecosystem.',
      content: `<h2>Welcome to SprouX</h2><p>SprouX is designed for creators who want to build products with community support. Unlike traditional crowdfunding, we focus on validation and trust through escrow.</p><p>We are the bridge for experts, educators, and makers who want to scale their business without the risk of building something nobody wants.</p>`,
      readingTime: 3,
      audience: 'creator',
      category: 'start',
      subcategory: 'basics',
      icon: 'Lightbulb',
      updatedAt: '2 days ago',
      status: 'published'
    },
    {
      id: 2,
      slug: 'creator-journey-explained',
      title: 'The creator journey explained',
      description: 'Understanding the four phases: Ideation, Validation, Funding, and Delivery.',
      content: `<h2>The 4 Phases</h2><p>Every project goes through these distinct stages: Ideation (Draft), Validation (Community interest), Funding (Live campaign), and Delivery (Fulfillment).</p>`,
      readingTime: 5,
      audience: 'creator',
      category: 'start',
      subcategory: 'basics',
      icon: 'Map',
      updatedAt: '1 week ago',
      status: 'published'
    },
    {
      id: 3,
      slug: 'idea-refinement-works',
      title: 'How idea refinement works',
      description: 'Using community feedback to polish your project concept before asking for funds.',
      content: `<h2>Refining your Idea</h2><p>Before launching, creators must go through a refinement phase where the community can ask questions and suggest improvements.</p>`,
      readingTime: 4,
      audience: 'creator',
      category: 'start',
      subcategory: 'refinement',
      icon: 'PenTool',
      updatedAt: '3 days ago',
      status: 'published'
    },
    {
      id: 8,
      slug: 'funding-goals-calculated',
      title: 'How funding goals are calculated',
      description: 'Setting realistic financial targets including fees, taxes, and manufacturing costs.',
      content: `<p>Calculate your goal by summing up production costs, platform fees (5%), and a buffer for unexpected taxes.</p>`,
      readingTime: 4,
      audience: 'creator',
      category: 'launch',
      subcategory: 'planning',
      icon: 'Calculator',
      updatedAt: '1 month ago',
      status: 'published'
    },
    {
      id: 9,
      slug: 'pricing-tiers-early-bird',
      title: 'Pricing tiers & early-bird rules explained',
      description: 'Strategies for structuring your rewards to incentivize early backers.',
      content: `<p>Early bird tiers create urgency. We recommend limited quantities at a 15-20% discount from the standard price.</p>`,
      readingTime: 5,
      audience: 'creator',
      category: 'launch',
      subcategory: 'rewards',
      icon: 'Tag',
      updatedAt: '3 weeks ago',
      status: 'published'
    },
    {
      id: 14,
      slug: 'how-escrow-works-creator',
      title: 'How escrow works (30/60/10) — creator view',
      description: 'Detailed breakdown of the tranche release system.',
      content: `<h2>The Tranche System</h2><p>Funds are held securely in a tiered release system to minimize risk for both parties.</p><ul><li>30% released upfront for materials.</li><li>60% released after delivery verification.</li><li>10% held for the guarantee period.</li></ul>`,
      readingTime: 5,
      audience: 'creator',
      category: 'deliver',
      subcategory: 'escrow',
      icon: 'Shield',
      isCritical: true,
      updatedAt: '1 week ago',
      status: 'published'
    },
    {
      id: 15,
      slug: 'when-receive-first-30',
      title: 'When do I receive the first 30%?',
      description: 'Timeline for the initial fund release following a successful campaign.',
      content: `<p>The first 30% is released when the campaign successfully ends and the cooling-off period passes.</p>`,
      readingTime: 3,
      audience: 'creator',
      category: 'deliver',
      subcategory: 'payouts',
      icon: 'Percent',
      isCritical: true,
      updatedAt: '3 days ago',
      status: 'published'
    },
    {
      id: 16,
      slug: 'dispute-types-explained',
      title: 'Types of disputes and when they happen',
      description: 'Categorizing common conflicts between creators and backers.',
      content: `<h2>Common Dispute Scenarios</h2><p>Disputes typically arise from three main areas: timeline delays without updates, substantial deviations from the validated concept, and complete non-delivery.</p><h3>Mediation Process</h3><p>SprouX acts as a neutral mediator to ensure the escrow system fairly evaluates proof of delivery vs. backer claims.</p>`,
      readingTime: 4,
      audience: 'creator',
      category: 'trust',
      subcategory: 'disputes',
      icon: 'Gavel',
      updatedAt: '1 month ago',
      status: 'published'
    },
    {
      id: 17,
      slug: 'why-escrow-exists',
      title: 'Why escrow exists',
      description: 'The philosophy behind our trust-based system.',
      content: `<h2>The Trust Deficit</h2><p>Traditional crowdfunding relies on blind trust. SprouX replaces this with protocol-level accountability. Escrow ensures that creators have the working capital to build, while backers have the security of knowing funds are only fully released upon delivery.</p>`,
      readingTime: 3,
      audience: 'creator',
      category: 'trust',
      subcategory: 'safety',
      icon: 'ShieldCheck',
      updatedAt: '2 weeks ago',
      status: 'published'
    },
    {
      id: 20,
      slug: 'backer-verification-works',
      title: 'How backer verification works (sampling & 80% rule)',
      description: 'Understanding the sampling process for delivery confirmation.',
      content: `<h2>The 80% Verification Rule</h2><p>The remaining 60% of funds is released once 80% of sampled backers confirm delivery.</p>`,
      readingTime: 5,
      audience: 'creator',
      category: 'deliver',
      subcategory: 'verification',
      icon: 'UserCheck',
      isCritical: true,
      updatedAt: '3 weeks ago',
      status: 'published'
    },
    {
      id: 35,
      slug: 'how-pledging-works',
      title: 'How pledging works',
      description: 'The process of supporting a campaign financially.',
      content: `<p>To pledge, simply select a reward tier and enter your payment details. You are only charged if the project hits its goal.</p>`,
      readingTime: 3,
      audience: 'backer',
      category: 'backer-basics',
      subcategory: 'pledging',
      icon: 'Heart',
      updatedAt: '1 week ago',
      status: 'published'
    },
    {
      id: 36,
      slug: 'updating-account-information',
      title: 'Updating account information',
      description: 'Changing your profile details and payment info.',
      content: `<h2>Managing Your Profile</h2><p>Keeping your account information up to date is essential for ensuring smooth payouts and secure communications. You can access your profile settings directly from your dashboard sidebar.</p><h3>Updating Personal Details</h3><p>You can change your display name, bio, and profile picture at any time. Changes to your bio will be reflected on your creator page immediately.</p><h3>Payment Information</h3><p>Ensure your connected bank account or payment processor is verified. Any changes to payment details will trigger a standard security verification process.</p>`,
      readingTime: 2,
      audience: 'creator',
      category: 'account',
      subcategory: 'profile',
      icon: 'Edit3',
      updatedAt: '1 week ago',
      status: 'published'
    },
    {
      id: 37,
      slug: 'how-to-verify-delivery',
      title: 'How to verify delivery',
      description: 'Confirming you received your item to release funds to the creator.',
      content: `<h2>Verifying Your Reward</h2><p>Once you receive your digital or physical product, you should verify delivery in your backer dashboard. This process ensures that creators are held accountable and that funds are released only when the community is satisfied.</p><h3>How to Confirm</h3><p>Navigate to your 'Backed Projects' section, find the specific campaign, and click the 'Confirm Receipt' button. A sample of backers is used to trigger the final 60% fund release based on the 80% verification rule.</p>`,
      readingTime: 2,
      audience: 'backer',
      category: 'backer-basics',
      subcategory: 'tracking',
      icon: 'CheckCircle',
      updatedAt: '1 week ago',
      status: 'published'
    },
    {
      id: 38,
      slug: 'disputes-refunds-for-backers',
      title: 'Disputes & refunds for backers',
      description: 'How to request a refund or open a dispute.',
      content: `<h2>Your Rights as a Backer</h2><p>SprouX is built on a foundation of trust and accountability. If a creator fails to deliver their promised reward or if the delivered product significantly deviates from the validated concept, you have the right to open a dispute or request a refund within the specified guarantee period.</p><h3>The Dispute Process</h3><p>To initiate a dispute, go to your dashboard, select the project, and click "Open Dispute". Our mediation team will review the evidence provided by both parties and the status of the escrowed funds to reach a fair resolution.</p>`,
      readingTime: 5,
      audience: 'backer',
      category: 'backer-trust',
      subcategory: 'protection',
      icon: 'RotateCcw',
      updatedAt: '1 week ago',
      status: 'published'
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat-1', name: 'Strategy', slug: 'strategy', description: 'Business strategy for creators.' },
    { id: 'cat-2', name: 'AI Tools', slug: 'ai-tools', description: 'Leveraging AI for productivity.' },
    { id: 'cat-3', name: 'Automation', slug: 'automation', description: 'Work smarter, not harder.', parentId: 'cat-2' },
  ]);

  const [mediaItems, setMediaItems] = useState<MediaAttachment[]>([
    {
      id: 'm1',
      fileName: 'hero-banner.jpg',
      fileType: 'image',
      mimeType: 'image/jpeg',
      fileSize: 102400,
      url: 'https://picsum.photos/seed/sproux/800/400',
      title: 'Hero Banner',
      uploadedBy: 'SprouX Admin',
      createdAt: '2024-03-20'
    }
  ]);

  const [pages, setPages] = useState<PageData[]>([
    {
      id: 'p-home',
      title: 'Home Page',
      slug: '/',
      status: 'published',
      updatedAt: '2024-03-20',
      blocks: [
        /* HOME HERO IS LOCKED - EXCLUDED FROM CMS */
        
        // PROBLEM SECTION
        { id: 'problem-title', label: 'Problem: Title', type: 'text', value: 'Where Most Creators Get Stuck', metadata: { group: 'Problem Section', editable: true } },
        { id: 'problem-desc', label: 'Problem: Description', type: 'text', value: 'You did everything right—built an audience, earned trust, showed up every day. But your business still isn’t truly yours.', metadata: { group: 'Problem Section', editable: true } },
        { id: 'problem-point-1', label: 'Problem: Pain Point 1', type: 'text', value: '70% of creators still depend on brand deals for survival.', metadata: { group: 'Problem Section', editable: true } },
        { id: 'problem-point-2', label: 'Problem: Pain Point 2', type: 'text', value: 'Platforms own your audience. One algorithm change can erase your income.', metadata: { group: 'Problem Section', editable: true } },
        { id: 'problem-point-3', label: 'Problem: Pain Point 3', type: 'text', value: 'You have real expertise—but turning it into recurring income still feels risky.', metadata: { group: 'Problem Section', editable: true } },
        { id: 'problem-old-label', label: 'Card: Old Model Heading', type: 'text', value: 'Old Model', metadata: { group: 'Problem Cards', editable: true } },
        { id: 'problem-old-micro', label: 'Card: Old Model Micro', type: 'text', value: 'Slave to algorithms. Unpredictable revenue.', metadata: { group: 'Problem Cards', editable: true } },
        { id: 'problem-new-label', label: 'Card: SprouX Model Heading', type: 'text', value: 'SprouX Model', metadata: { group: 'Problem Cards', editable: true } },
        { id: 'problem-new-micro', label: 'Card: SprouX Model Micro', type: 'text', value: 'Asset ownership. Automated launch. Scale.', metadata: { group: 'Problem Cards', editable: true } },
        { id: 'problem-img-1', label: 'Old Model Image', type: 'image', value: 'https://picsum.photos/400/400?grayscale', metadata: { group: 'Problem Cards', editable: true, alt: 'Frustrated Creator' } },
        { id: 'problem-img-2', label: 'SprouX Model Image', type: 'image', value: 'https://picsum.photos/401/401', metadata: { group: 'Problem Cards', editable: true, alt: 'Empowered Entrepreneur' } },

        // SOLUTION SECTION
        { id: 'solution-title', label: 'Solution: Title', type: 'text', value: 'Your Vision. Validated. Launched.', metadata: { group: 'Solution Section', editable: true } },
        { id: 'solution-subtext', label: 'Solution: Subtext', type: 'text', value: 'SprouX is the bridge from Creator to Entrepreneur.<br />Stop guessing. Start launching with confidence.', metadata: { group: 'Solution Section', editable: true } },
        { id: 'solution-ai-synced-label', label: 'Badge: AI Synced Text', type: 'text', value: '', metadata: { group: 'Solution Section', editable: true } },
        { id: 'phase-1-title', label: 'Phase 1: Title', type: 'text', value: 'Idea<br />Refinement', metadata: { group: 'Solution Phases', editable: true } },
        { id: 'phase-1-desc', label: 'Phase 1: Description', type: 'text', value: 'Turn scattered thoughts and expertise into clear product ideas. Our AI aligns what you know best with market signals—so you start with ideas worth validating.', metadata: { group: 'Solution Phases', editable: true } },
        { id: 'phase-2-title', label: 'Phase 2: Title', type: 'text', value: 'Concept Validation', metadata: { group: 'Solution Phases', editable: true } },
        { id: 'phase-2-desc', label: 'Phase 2: Description', type: 'text', value: 'Automatically generate test landing pages and surveys to validate demand with your audience. See what resonates, what converts, and what they’re actually willing to pay for.', metadata: { group: 'Solution Phases', editable: true } },
        { id: 'phase-3-title', label: 'Phase 3: Title', type: 'text', value: 'Re-sell Campaign', metadata: { group: 'Solution Phases', editable: true } },
        { id: 'phase-3-desc', label: 'Phase 3: Description', type: 'text', value: 'Turn validated concepts into a pre-sell campaign. Launch with landing pages, pricing, funding goals, and messaging in place, so you go live & start collecting pre-orders.', metadata: { group: 'Solution Phases', editable: true } },
        { id: 'phase-4-title', label: 'Phase 4: Title', type: 'text', value: 'Delivery & Fund Release', metadata: { group: 'Solution Phases', editable: true } },
        { id: 'phase-4-desc', label: 'Phase 4: Description', type: 'text', value: 'Deliver with built-in escrow and verification that protects both sides. You receive working capital upfront, then funds unlock automatically as backers confirm delivery.', metadata: { group: 'Solution Phases', editable: true } },

        // WHY CHOOSE SPROUX (BENEFITS)
        { id: 'benefit-title', label: 'Benefits: Title', type: 'text', value: 'Why Choose SprouX?', metadata: { group: 'Benefits Section', editable: true } },
        { id: 'benefit-desc', label: 'Benefits: Subtitle', type: 'text', value: 'The ultimate toolkit for the modern knowledge entrepreneur.', metadata: { group: 'Benefits Section', editable: true } },
        { id: 'benefit-1-title', label: 'Benefit 1: Title', type: 'text', value: 'Comprehensive launch system', metadata: { group: 'Benefit Grid', editable: true } },
        { id: 'benefit-1-desc', label: 'Benefit 1: Desc', type: 'text', value: 'Covers the full journey from idea refinement and validation to pre-sell and delivery.', metadata: { group: 'Benefit Grid', editable: true } },
        { id: 'benefit-2-title', label: 'Benefit 2: Title', type: 'text', value: 'AI-Powered Guidance', metadata: { group: 'Benefit Grid', editable: true } },
        { id: 'benefit-2-desc', label: 'Benefit 2: Desc', type: 'text', value: 'AI assists at every stage, giving creators clarity, insights, and actionable recommendations.', metadata: { group: 'Benefit Grid', editable: true } },
        { id: 'benefit-3-title', label: 'Benefit 3: Title', type: 'text', value: 'Risk-free for creators and backers', metadata: { group: 'Benefit Grid', editable: true } },
        { id: 'benefit-3-desc', label: 'Benefit 3: Desc', type: 'text', value: 'Pre-orders secure early revenue while escrow and verification protect backers.', metadata: { group: 'Benefit Grid', editable: true } },
        { id: 'benefit-4-title', label: 'Benefit 4: Title', type: 'text', value: 'From idea to campaign-ready in days', metadata: { group: 'Benefit Grid', editable: true } },
        { id: 'benefit-4-desc', label: 'Benefit 4: Desc', type: 'text', value: 'A structured flow replaces scattered tools, helping creators go from idea to live campaign fast.', metadata: { group: 'Benefit Grid', editable: true } },

        // CO-CREATORS
        { id: 'creators-title', label: 'Creators: Title', type: 'text', value: 'Join the New Generation of Knowledge Entrepreneurs', metadata: { group: 'Creators Section', editable: true } },
        { id: 'creators-subtext', label: 'Creators: Subtext', type: 'text', value: 'Meet our Co-Creators—visionaries partnering with SprouX to shape the platform and the way creators turn their expertise into impact.', metadata: { group: 'Creators Section', editable: true } },
        { id: 'creators-cta', label: 'Creators: CTA Button', type: 'text', value: 'Be Our Co-Creator', metadata: { group: 'Creators Section', editable: true } },
        { id: 'creators-view-profile-btn', label: 'Creators: Profile Button Label', type: 'text', value: 'View Profile', metadata: { group: 'Creators Section', editable: true } },
        { id: 'creators-footer-msg', label: 'Creators: Footer Message', type: 'text', value: 'Join us in reshaping the future of creator-led knowledge products—and unlock privileges worth up to <span class="text-primary font-bold">$1,000</span> per creator.', metadata: { group: 'Creators Section', editable: true } },
        { id: 'creator-1-name', label: 'Creator 1: Name', type: 'text', value: 'Alex Rivera', metadata: { group: 'Creator 1', editable: true } },
        { id: 'creator-1-role', label: 'Creator 1: Role', type: 'text', value: 'AI Automation Expert', metadata: { group: 'Creator 1', editable: true } },
        { id: 'creator-1-quote', label: 'Creator 1: Quote', type: 'text', value: 'Partnering with SprouX to streamline how technical experts package workflow.', metadata: { group: 'Creator 1', editable: true } },
        { id: 'creator-1-img', label: 'Creator 1: Image', type: 'image', value: 'https://picsum.photos/400/400?random=1', metadata: { group: 'Creator 1', editable: true } },
        { id: 'creator-2-name', label: 'Creator 2: Name', type: 'text', value: 'Sarah Chen', metadata: { group: 'Creator 2', editable: true } },
        { id: 'creator-2-role', label: 'Creator 2: Role', type: 'text', value: 'Finance Creator', metadata: { group: 'Creator 2', editable: true } },
        { id: 'creator-2-quote', label: 'Creator 2: Quote', type: 'text', value: 'Testing data-driven idea validation to ensure every launch is a win.', metadata: { group: 'Creator 2', editable: true } },
        { id: 'creator-2-img', label: 'Creator 2: Image', type: 'image', value: 'https://picsum.photos/400/400?random=2', metadata: { group: 'Creator 2', editable: true } },

        // FINAL CTA
        { id: 'cta-badge', label: 'CTA: Badge Text', type: 'text', value: 'Limited Beta Now Open', metadata: { group: 'Final CTA', editable: true } },
        { id: 'cta-title', label: 'CTA: Headline', type: 'text', value: 'Ready to Launch<br />Your Big Idea?', metadata: { group: 'Final CTA', editable: true } },
        { id: 'cta-desc', label: 'CTA: Description', type: 'text', value: "Build your vision and monetize your knowledge today.", metadata: { group: 'Final CTA', editable: true } },
        { id: 'cta-btn', label: 'CTA: Button Text', type: 'text', value: 'Launch Now', metadata: { group: 'Final CTA', editable: true } },
        { id: 'cta-perk-1', label: 'CTA: Perk 1', type: 'text', value: 'Risk-Free Infrastructure', metadata: { group: 'Final CTA', editable: true } },
        { id: 'cta-perk-2', label: 'CTA: Perk 2', type: 'text', value: 'No Technical Setup', metadata: { group: 'Final CTA', editable: true } },
        { id: 'cta-perk-3', label: 'CTA: Perk 3', type: 'text', value: 'AI Launch Support', metadata: { group: 'Final CTA', editable: true } },
      ]
    },
    {
      id: 'p-pricing',
      title: 'Pricing Page',
      slug: '/pricing',
      status: 'published',
      updatedAt: '2024-03-20',
      blocks: [
        { id: 'pricing-hero-title', label: 'Hero: Headline', type: 'text', value: 'Choose Your Plan', metadata: { group: 'Hero Section', editable: true } },
        { id: 'pricing-hero-desc', label: 'Hero: Subheadline', type: 'text', value: 'Flexible options to suit your workflow. Pay as you go, subscribe, or buy credits for AI features.', metadata: { group: 'Hero Section', editable: true } },
        { 
          id: 'plan-1', 
          label: 'Plan Card 1', 
          type: 'pricing-plan', 
          value: JSON.stringify({
            name: 'Pay Per Launch',
            price: '$TBD',
            description: 'Perfect for one-off projects or creators testing the waters.',
            features: ['Single Project Lifecycle', 'Concept Validation Suite', 'Pre-selling Event Tools', 'Automated Fund Release System', 'Pay only when you launch'],
            ctaText: 'Select Per Launch',
            ctaVariant: 'neutral',
            icon: 'Rocket'
          }), 
          metadata: { group: 'Pricing Plans', editable: true } 
        },
        { 
          id: 'plan-2', 
          label: 'Plan Card 2', 
          type: 'pricing-plan', 
          value: JSON.stringify({
            name: 'Subscription',
            price: '$TBD',
            description: 'For consistent growth and ongoing AI-powered iteration.',
            features: ['Unlimited Idea Refinements', 'Ongoing Market Sentiment Analysis', 'Full CRM & Audience Management', 'Priority 24/7 AI Support', 'Lower Commission per Sale'],
            ctaText: 'Get Started',
            ctaVariant: 'primary',
            icon: 'Zap',
            highlight: 'Most Sustainable'
          }), 
          metadata: { group: 'Pricing Plans', editable: true, highlighted: true } 
        },
        { 
          id: 'plan-3', 
          label: 'Plan Card 3', 
          type: 'pricing-plan', 
          value: JSON.stringify({
            name: 'Credit Packs',
            price: '$TBD',
            description: 'Best for scaling specific AI tasks without monthly commitment.',
            features: ['Credits never expire', 'Advanced AI Analysis access', 'Custom Market Reports', 'Top-up whenever needed', 'Shared across multiple projects'],
            ctaText: 'Buy Credits',
            ctaVariant: 'secondary',
            icon: 'Coins'
          }), 
          metadata: { group: 'Pricing Plans', editable: true } 
        },
        { 
          id: 'faq-1', 
          label: 'FAQ Block 1', 
          type: 'faq-item', 
          value: JSON.stringify({
            question: 'Can I switch between plans?',
            answer: 'Yes! You can transition from a Per-Launch model to a Subscription as your project frequency increases.'
          }), 
          metadata: { group: 'FAQs', editable: true } 
        },
        { 
          id: 'faq-2', 
          label: 'FAQ Block 2', 
          type: 'faq-item', 
          value: JSON.stringify({
            question: 'How do Credits work?',
            answer: 'Credits are used for intensive AI features like deep-market analysis and automated content generation.'
          }), 
          metadata: { group: 'FAQs', editable: true } 
        }
      ]
    },
    {
      id: 'p-how-it-works',
      title: 'How It Works',
      slug: '/how-it-works',
      status: 'published',
      updatedAt: '2024-03-20',
      blocks: [
        { id: 'hiw-hero-title', label: 'Hero: Headline', type: 'text', value: 'The 4-Phase Knowledge Launch System', metadata: { group: 'Hero Section', editable: true } },
        { id: 'hiw-hero-desc', label: 'Hero: Subheadline', type: 'text', value: 'From idea to pre-orders in days. Use our AI-driven framework to refine your expertise and secure your future.', metadata: { group: 'Hero Section', editable: true } },
        { id: 'hiw-hero-cta', label: 'Hero: CTA Button', type: 'text', value: 'Get Started', metadata: { group: 'Hero Section', editable: true } },
        { id: 'phase1-tab-label', label: 'P1: Tab Label', type: 'text', value: 'Idea Refinement', metadata: { group: 'Phase 1 Detail', editable: true } },
        { id: 'phase1-full-title', label: 'P1: Full Detailed Headline', type: 'text', value: 'Idea Refinement: Refine Your Idea in Minutes', metadata: { group: 'Phase 1 Detail', editable: true } },
        { id: 'phase1-subheadline', label: 'P1: Subheadline', type: 'text', value: 'Turn a vague concept into a clear, market-ready idea. Our AI-guided framework gives you structure, clarity, and confidence to move forward.', metadata: { group: 'Phase 1 Detail', editable: true } },
        { id: 'phase1-step1', label: 'P1: Step 1', type: 'text', value: 'Start the AI Conversation – Answer targeted questions about your content type, audience, and the problem you’re solving.', metadata: { group: 'Phase 1 Detail', editable: true } },
        { id: 'phase1-step2', label: 'P1: Step 2', type: 'text', value: 'Clarify Your Outcome – Define the result your audience will achieve and the format of your offering.', metadata: { group: 'Phase 1 Detail', editable: true } },
        { id: 'phase1-step3', label: 'P1: Step 3', type: 'text', value: 'Set Scope & Pricing – Determine the course duration, modules, and preliminary pricing hypothesis.', metadata: { group: 'Phase 1 Detail', editable: true } },
        { id: 'phase1-step4', label: 'P1: Step 4', type: 'text', value: 'Generate Your Concept Summary – Get a structured overview including title, positioning, outline, and delivery timeline.', metadata: { group: 'Phase 1 Detail', editable: true } },
        { id: 'phase2-tab-label', label: 'P2: Tab Label', type: 'text', value: 'Concept Validation', metadata: { group: 'Phase 2 Detail', editable: true } },
        { id: 'phase2-full-title', label: 'P2: Full Detailed Headline', type: 'text', value: 'Concept Validation: Test Your Concept with Real Backers', metadata: { group: 'Phase 2 Detail', editable: true } },
        { id: 'phase2-subheadline', label: 'P2: Subheadline', type: 'text', value: 'Use simple, data-driven tactics to see if your idea resonates, measures interest, and identifies potential buyers.', metadata: { group: 'Phase 2 Detail', editable: true } },
        { id: 'phase2-step1', label: 'P2: Step 1', type: 'text', value: 'Select Platforms to Test: Choose 1–3 of your existing audiences to run validation tactics.', metadata: { group: 'Phase 2 Detail', editable: true } },
        { id: 'phase2-step2', label: 'P2: Step 2', type: 'text', value: 'Run Validation Tactics: Deploy lightweight methods like landing pages, polls, surveys, and teaser videos.', metadata: { group: 'Phase 2 Detail', editable: true } },
        { id: 'phase2-step3', label: 'P2: Step 3', type: 'text', value: 'Track Results in Real-Time: See reach, engagement, and interest aggregated in a single dashboard.', metadata: { group: 'Phase 2 Detail', editable: true } },
        { id: 'phase2-step4', label: 'P2: Step 4', type: 'text', value: 'Capture Top Questions: Automatically collect audience questions to pre-populate your FAQ.', metadata: { group: 'Phase 2 Detail', editable: true } },
        { id: 'phase3-tab-label', label: 'P3: Tab Label', type: 'text', value: 'Pre-selling Campaign', metadata: { group: 'Phase 3 Detail', editable: true } },
        { id: 'phase3-full-title', label: 'P3: Full Detailed Headline', type: 'text', value: 'Pre-selling Campaign: Launch Your Validated Concept', metadata: { group: 'Phase 3 Detail', editable: true } },
        { id: 'phase3-subheadline', label: 'P3: Subheadline', type: 'text', value: 'Turn validated concepts into a pre-sell campaign. Launch with landing pages, pricing, funding goals, and messaging in place, so you go live & start collecting pre-orders.', metadata: { group: 'Phase 3 Detail', editable: true } },
        { id: 'phase3-step1', label: 'P3: Step 1', type: 'text', value: 'Pre-Populate Your Campaign: Phase A concept and Phase B validation data automatically fill details.', metadata: { group: 'Phase 3 Detail', editable: true } },
        { id: 'phase3-step2', label: 'P3: Step 2', type: 'text', value: 'Customize & Refine: Adjust media, description, modules, pricing, and delivery details.', metadata: { group: 'Phase 3 Detail', editable: true } },
        { id: 'phase3-step3', label: 'P3: Step 3', type: 'text', value: 'Set Funding Goal: Suggested target based on validation results gives you confidence.', metadata: { group: 'Phase 3 Detail', editable: true } },
        { id: 'phase3-step4', label: 'P3: Step 4', type: 'text', value: 'Launch & Track: Go live and monitor pledges, conversions, and backer questions in real-time.', metadata: { group: 'Phase 3 Detail', editable: true } },
        { id: 'phase4-tab-label', label: 'P4: Tab Label', type: 'text', value: 'Delivery & Fund Release', metadata: { group: 'Phase 4 Detail', editable: true } },
        { id: 'phase4-full-title', label: 'P4: Full Detailed Headline', type: 'text', value: 'Delivery & Fund Release: Get Paid, Build Trust', metadata: { group: 'Phase 4 Detail', editable: true } },
        { id: 'phase4-subheadline', label: 'P4: Subheadline', type: 'text', value: 'Ensure creators deliver what they promised and backers receive it, using automated verification and staged fund release.', metadata: { group: 'Phase 4 Detail', editable: true } },
        { id: 'phase4-step1', label: 'P4: Step 1', type: 'text', value: 'Submit Delivery Proof: Creators provide access links and screenshots showing content is live.', metadata: { group: 'Phase 4 Detail', editable: true } },
        { id: 'phase4-step2', label: 'P4: Step 2', type: 'text', value: 'Backer Verification: A random sample of backers confirms receipt via one-click email.', metadata: { group: 'Phase 4 Detail', editable: true } },
        { id: 'phase4-step3', label: 'P4: Step 3', type: 'text', value: 'Staged Fund Release: Funds held in escrow are released in 3 stages.', metadata: { group: 'Phase 4 Detail', editable: true } },
        { id: 'phase4-step4', label: 'P4: Step 4', type: 'text', value: 'Community Updates & Comments: Creators share progress updates and interact with backers.', metadata: { group: 'Phase 4 Detail', editable: true } },
        { id: 'hiw-benefit-title', label: 'Why It Works: Title', type: 'text', value: 'Why This Process Works?', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-benefit-1-icon', label: 'Benefit 1: Icon', type: 'text', value: 'Users', metadata: { group: 'Why It Works', editable: true, type: 'icon' } },
        { id: 'hiw-benefit-1-title', label: 'Benefit 1: Title', type: 'text', value: 'Structured Path', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-benefit-1-desc', label: 'Benefit 1: Description', type: 'text', value: 'Clear, step-by-step flow from idea to delivery keeps creators focused and efficient.', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-benefit-2-icon', label: 'Benefit 2: Icon', type: 'text', value: 'ShieldAlert', metadata: { group: 'Why It Works', editable: true, type: 'icon' } },
        { id: 'hiw-benefit-2-title', label: 'Benefit 2: Title', type: 'text', value: 'Risk Minimization', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-benefit-2-desc', label: 'Benefit 2: Description', type: 'text', value: 'Validate demand before building, ensuring time and effort are invested wisely.', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-benefit-3-icon', label: 'Benefit 3: Icon', type: 'text', value: 'Zap', metadata: { group: 'Why It Works', editable: true, type: 'icon' } },
        { id: 'hiw-benefit-3-title', label: 'Benefit 3: Title', type: 'text', value: 'Faster Launch', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-benefit-3-desc', label: 'Benefit 3: Description', type: 'text', value: 'Pre-populated campaigns and guided steps dramatically reduce setup time.', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-benefit-4-icon', label: 'Benefit 4: Icon', type: 'text', value: 'BarChart4', metadata: { group: 'Why It Works', editable: true, type: 'icon' } },
        { id: 'hiw-benefit-4-title', label: 'Benefit 4: Title', type: 'text', value: 'Actionable Insights', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-benefit-4-desc', label: 'Benefit 4: Description', type: 'text', value: 'Real-time analytics and verification metrics help creators adjust strategy quickly.', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-benefit-5-icon', label: 'Benefit 5: Icon', type: 'text', value: 'TrendingUp', metadata: { group: 'Why It Works', editable: true, type: 'icon' } },
        { id: 'hiw-benefit-5-title', label: 'Benefit 5: Title', type: 'text', value: 'Revenue Confidence', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-benefit-5-desc', label: 'Benefit 5: Description', type: 'text', value: 'Pre-orders and funding guidance turn interest into real commitments early.', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-benefit-6-icon', label: 'Benefit 6: Icon', type: 'text', value: 'Lock', metadata: { group: 'Why It Works', editable: true, type: 'icon' } },
        { id: 'hiw-benefit-6-title', label: 'Benefit 6: Title', type: 'text', value: 'Trust & Accountability', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-benefit-6-desc', label: 'Benefit 6: Description', type: 'text', value: 'Escrow and verification ensure backers get what they paid for, and creators get paid reliably.', metadata: { group: 'Why It Works', editable: true } },
        { id: 'hiw-fcta-title', label: 'HIW CTA: Headline', type: 'text', value: 'Launch Your First<br />Knowledge Product', metadata: { group: 'HIW CTA', editable: true } },
        { id: 'hiw-fcta-desc', label: 'HIW CTA: Description', type: 'text', value: 'From idea to pre-orders in days—guided, structured, and risk-free.', metadata: { group: 'HIW CTA', editable: true } },
        { id: 'hiw-fcta-btn', label: 'HIW CTA: Button Text', type: 'text', value: 'Begin My Launch', metadata: { group: 'HIW CTA', editable: true } }
      ]
    },
    {
      id: 'p-help-desk',
      title: 'Help Center',
      slug: '/help-desk',
      status: 'published',
      updatedAt: '2024-03-20',
      blocks: [
        { id: 'hd-hero-title', label: 'Hero: Headline', type: 'text', value: 'How can we help?', metadata: { group: 'Hero Section', editable: true } },
        { id: 'cat-gs-title', label: 'Collection 1: Title', type: 'text', value: 'Getting Started', metadata: { group: 'Collections', editable: true } },
        { id: 'cat-gs-desc', label: 'Collection 1: Description', type: 'text', value: 'Learn the core concepts and launch your first campaign.', metadata: { group: 'Collections', editable: true } },
        { id: 'cat-billing-title', label: 'Collection 2: Title', type: 'text', value: 'Billing & Payments', metadata: { group: 'Collections', editable: true } },
        { id: 'cat-billing-desc', label: 'Collection 2: Description', type: 'text', value: 'Manage subscriptions, credit packs, and fund withdrawals.', metadata: { group: 'Collections', editable: true } },
        { id: 'cat-safety-title', label: 'Collection 3: Title', type: 'text', value: 'Trust & Safety', metadata: { group: 'Collections', editable: true } },
        { id: 'cat-safety-desc', label: 'Collection 3: Description', type: 'text', value: 'Understanding escrow, verification, and community guidelines.', metadata: { group: 'Collections', editable: true } },
        { id: 'art-1-title', label: 'Article 1: Title', type: 'text', value: 'Setting up your first pre-sale campaign', metadata: { group: 'Promoted Articles', editable: true } },
        { id: 'art-2-title', label: 'Article 2: Title', type: 'text', value: 'Understanding the 3-stage fund release', metadata: { group: 'Promoted Articles', editable: true } },
        { id: 'art-3-title', label: 'Article 2: Title', type: 'text', value: 'How to verify delivery for your backers', metadata: { group: 'Promoted Articles', editable: true } },
        { id: 'supp-card-title', label: 'Contact: Title', type: 'text', value: 'Still have questions?', metadata: { group: 'Support', editable: true } },
        { id: 'supp-card-desc', label: 'Contact: Description', type: 'text', value: 'Our team is available 24/7 to help you navigate your creator journey.', metadata: { group: 'Support', editable: true } }
      ]
    }
  ]);

  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'The Future of Knowledge Autonomy',
      slug: 'future-knowledge-autonomy',
      excerpt: 'How AI is changing the landscape for independent creators.',
      author: 'SprouX Admin',
      authorId: 'admin-01',
      content: 'AI is not just a tool; it is a partner in the creative process...',
      status: 'published',
      publishedAt: '2024-03-20',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20',
      categoryIds: ['cat-1', 'cat-3'],
      tags: ['ai', 'strategy'],
      coverImage: 'https://picsum.photos/800/400?random=10',
      seoScore: 85,
      seo: { 
        title: 'Knowledge Autonomy | SprouX Blog', 
        description: 'AI and Creators strategy article.',
        ogTitle: 'The Future of Knowledge Autonomy',
        ogDescription: 'How AI is changing the landscape for independent creators.'
      }
    }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const handleNavigate = (newView: ViewType) => {
    // Redirect to login if trying to access admin without session
    if (newView === 'admin' && !user) {
      setView('admin-login');
      return;
    }
    setView(newView);
  };

  const handleLoginSuccess = (adminUser: User) => {
    setUser(adminUser);
    setView('admin');
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  const isCMS = view === 'admin';
  const isLoginPage = view === 'admin-login';

  const isPageVisible = (pageId: string) => {
    const p = pages.find(page => page.id === pageId);
    return p?.status === 'published';
  };

  const getPageContent = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return {};
    const content: Record<string, string> = {};
    page.blocks.forEach(b => {
      content[b.id] = b.value;
      if (b.type === 'image' && b.metadata?.alt) {
        content[`${b.id}-alt`] = b.metadata.alt;
      }
    });
    return content;
  };

  const renderView = () => {
    if (isCMS) {
      // Security Check (Redundant but safe)
      if (!user) {
        setView('admin-login');
        return null;
      }

      return (
        <CMS 
          onNavigate={handleNavigate} 
          user={user} 
          onLogout={handleLogout} 
          posts={posts}
          setPosts={setPosts}
          categories={categories}
          setCategories={setCategories}
          mediaItems={mediaItems}
          setMediaItems={setMediaItems}
          pages={pages}
          setPages={setPages}
          // Bridge Help Desk State
          hdCategories={hdCategories}
          setHdCategories={setHdCategories}
          hdTopics={hdTopics}
          setHdTopics={setHdTopics}
          hdArticles={hdArticles}
          setHdArticles={setHdArticles}
          // Bridge Users State
          users={users}
          setUsers={setUsers}
          // Global Site Settings - SPLIT
          headerLogo={headerLogo}
          setHeaderLogo={setHeaderLogo}
          footerLogo={footerLogo}
          setFooterLogo={setFooterLogo}
          // --- Lifted CMS State Control ---
          activeTab={cmsTab}
          setActiveTab={setCmsTab}
          postsSubTab={cmsPostsSubTab}
          setPostsSubTab={setCmsPostsSubTab}
          isEditorOpen={cmsIsEditorOpen}
          setIsEditorOpen={setCmsIsEditorOpen}
          editingPost={cmsEditingPost}
          setEditingPost={setCmsEditingPost}
          onPreviewPost={(post) => {
            setSelectedPost(post);
            setView('post-detail');
          }}
        />
      );
    }

    if (isLoginPage) {
      return <Login users={users} onLoginSuccess={handleLoginSuccess} onBack={() => setView('home')} />;
    }

    if (view === 'home') {
      if (!isPageVisible('p-home')) return <NotFound onBack={() => window.location.reload()} />;
      const content = getPageContent('p-home');
      return (
        <>
          <Hero onNavigate={handleNavigate} />
          <Problem content={content} />
          <Solution content={content} />
          <WhySprouX content={content} />
          <CreatorsGrid content={content} />
          <FinalCTA content={content} />
        </>
      );
    }

    if (view === 'pricing') {
      if (!isPageVisible('p-pricing')) return <NotFound onBack={() => setView('home')} />;
      return <Pricing page={pages.find(p => p.id === 'p-pricing')} />;
    }

    if (view === 'how-it-works') {
      if (!isPageVisible('p-how-it-works')) return <NotFound onBack={() => setView('home')} />;
      return <HowItWorks onNavigate={handleNavigate} content={getPageContent('p-how-it-works')} />;
    }

    if (view === 'blog') {
      return (
        <Blog 
          onNavigate={handleNavigate} 
          posts={posts.filter(p => p.status === 'published')} 
          categories={categories}
          onSelectPost={(post) => {
            setSelectedPost(post);
            setView('post-detail');
          }}
        />
      );
    }

    if (view === 'post-detail') {
      if (!selectedPost) return <NotFound onBack={() => setView('home')} />;
      return <PostDetail post={selectedPost} onBack={() => setView(user?.role === 'administrator' || user?.role === 'editor' ? 'admin' : 'blog')} />;
    }

    if (view === 'help-desk') {
      if (!isPageVisible('p-help-desk')) return <NotFound onBack={() => window.location.reload()} />;
      return (
        <HelpDesk 
          onNavigate={handleNavigate} 
          content={getPageContent('p-help-desk')}
          categories={hdCategories}
          topics={hdTopics}
          articles={hdArticles.filter(a => a.status === 'published')}
        />
      );
    }

    return <NotFound onBack={() => setView('home')} />;
  };

  return (
    <div className="min-h-screen selection:bg-teal-100 selection:text-teal-900">
      {!isCMS && !isLoginPage && <Navbar onNavigate={handleNavigate} currentView={view} user={user} onLogout={handleLogout} logoUrl={headerLogo} categories={categories} />}
      <main>{renderView()}</main>
      {!isCMS && !isLoginPage && <Footer onNavigate={handleNavigate} logoUrl={footerLogo} />}
    </div>
  );
};

export default App;
