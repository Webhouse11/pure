
export type Category = 'Home Workouts' | 'Weight Loss' | 'Muscle Building' | 'Low-Impact' | 'Senior Fitness' | 'Recovery' | 'Nutrition';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  author: string;
  datePublished: string;
  dateModified: string;
  image: string;
  imageAlt: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  showBranding?: boolean; // New property to toggle company branding on images
}

export type AdPlacement = 
  | 'leaderboard' 
  | 'anchor' 
  | 'sidebar' 
  | 'in-text' 
  | 'sticky' 
  | 'inter-article' 
  | 'skyscraper' 
  | 'mobile-leaderboard'
  | 'mobile-tenancy'
  | 'mobile-in-text'
  | 'mobile-anchor'
  | 'mobile-inter-article'
  | 'mobile-in-stream'
  | 'tenancy-rectangle'
  | 'interstitial'
  | 'in-stream-video'
  | 'sponsorship-badge'
  | 'pop-under';

export interface AdConfig {
  active: boolean;
  code: string;
}

export type AdSettings = Record<AdPlacement, AdConfig>;

export interface SiteSettings {
  name: string;
  tagline: string;
  metaDescription: string;
  contactEmail: string;
}
