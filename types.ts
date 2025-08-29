
export enum Tool {
  META_TAGS = 'Meta Tag Generator',
  SERP_PREVIEW = 'SERP Snippet Preview',
  KEYWORD_DENSITY = 'Keyword Density Checker',
  FILE_GENERATOR = 'File Generator',
  COMPETITOR_RESEARCH = 'Competitor Research',
  BACKLINK_CHECKER = 'Backlink Checker',
  ON_PAGE_ANALYZER = 'On-Page SEO Analyzer',
  LIGHTHOUSE_REPORT = 'Lighthouse SEO Report',
  CONTENT_GAP = 'Content Gap Analysis',
  PAA_EXTRACTOR = 'People Also Ask Extractor',
  SEARCH_INTENT = 'Search Intent Classifier',
  CONTENT_BRIEF = 'AI Content Brief Builder',
  ADMIN_PANEL = 'Admin Panel',
}

export interface User {
  email: string;
  name?: string;
  picture?: string;
  role: 'admin' | 'user';
  isApproved: boolean;
  approvedTools: Tool[];
}

export interface KeywordDensityResult {
  keyword: string;
  count: number;
  density: string;
}

export interface CompetitorAnalysisResult {
  summary: string;
  mainKeywords: string[];
  contentStrategy: string;
  seoStrengths: string[];
  seoWeaknesses: string[];
  domainAuthority: string;
  estimatedMonthlyTraffic: string;
  backlinkCount: string;
}

export interface BacklinkResult {
  sourceUrl: string;
  anchorText: string;
  sourceDomainAuthority: string;
}

export interface OnPageImage {
  src: string;
  alt: string;
}

export interface OnPageLink {
  text: string;
  href: string;
}

export interface OnPageAnalysisResult {
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  images: OnPageImage[];
  links: {
    internal: OnPageLink[];
    external: OnPageLink[];
  };
}

export interface LighthouseAuditItem {
    title: string;
    description: string;
}

export interface LighthouseCategoryResult {
    passed: LighthouseAuditItem[];
    improvements: LighthouseAuditItem[];
}

export interface LighthouseReportResult {
    scores: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
    };
    audits: {
        performance: LighthouseCategoryResult;
        accessibility: LighthouseCategoryResult;
        bestPractices: LighthouseCategoryResult;
        seo: LighthouseCategoryResult;
    }
}

export interface ContentGapResult {
  gapKeywords: string[];
}

export interface PaaResult {
  questions: string[];
}

export interface SearchIntentResult {
  keyword: string;
  intent: 'Informational' | 'Navigational' | 'Commercial' | 'Transactional' | 'Unknown';
  explanation: string;
}

export interface ContentBriefOutlineItem {
  heading: string; // e.g., "H2: Understanding Core Web Vitals"
  subheadings: string[]; // e.g., ["H3: What is LCP?", "H3: What is FID?"]
}

export interface ContentBriefResult {
  title: string;
  targetAudience: string;
  outline: ContentBriefOutlineItem[];
  relatedKeywords: string[];
  wordCount: string;
  internalLinkSuggestions: {
    anchorText: string;
    suggestedUrl: string; // e.g., "/blog/what-is-seo"
  }[];
}