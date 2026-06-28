export interface NavItem {
  label: string;
  href: string;
}

export interface TechnologyStep {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface TextPair {
  label: string;
  value: string;
}

export interface ContentBlock {
  title: string;
  text: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductFamily {
  id: string;
  aliases?: string[];
  number: string;
  title: string;
  label: string;
  summary: string;
  detailTitle: string;
  detailIntro: string;
  image: string;
  gallery: string[];
  variants?: TextPair[];
  specs: string[];
  useCases: string[];
  integration: string[];
  constraints: string[];
  proofPoints?: TextPair[];
  faq?: FaqItem[];
  specificationRows: Array<{
    label: string;
    value: string;
  }>;
}

export interface BaFormat {
  id: string;
  title: string;
  meta: string;
  image: string;
}

export interface Market {
  id: string;
  aliases?: string[];
  title: string;
  headline: string;
  description: string;
  image: string;
  specs?: TextPair[];
  needs: string[];
  applications: string[];
  benefits?: string[];
  faq?: FaqItem[];
  recommendedProducts: string[];
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  publishDate: string;
  seoTitle: string;
  seoDescription: string;
  body: ContentBlock[];
}

export interface PressItem {
  media: string;
  date: string;
  format: string;
}

export interface Capability {
  title: string;
  text: string;
}

export interface LegalPage {
  slug: string;
  title: string;
  intro: string;
  sections: ContentBlock[];
}
