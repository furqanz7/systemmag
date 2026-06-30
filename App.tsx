import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  ChevronDown,
  ChevronLeft,
  Clock3,
  Download,
  Factory,
  FileText,
  Layers3,
  Magnet,
  Mail,
  MapPin,
  Menu,
  Phone,
  Ruler,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ABOUT_TIMELINE,
  APP_NAME,
  BA_FORMATS,
  BLOG_POSTS,
  LEGAL_PAGES,
  MARKETS,
  PRESS_ITEMS,
  PROCESS_STEPS,
  PRODUCT_DECISION_PATHS,
  PRODUCTS,
  TECHNOLOGY_CAPABILITIES,
  TECHNOLOGY_COMPARISON,
  TECHNOLOGY_STEPS,
  TRUST_BADGES,
} from './constants';
import { EN_TRANSLATIONS } from './i18n';
import type { BlogPost, LegalPage, Market, ProductFamily } from './types';

gsap.registerPlugin(ScrollTrigger);

type AppRoute =
  | { kind: 'home' }
  | { kind: 'product'; id: string }
  | { kind: 'products' }
  | { kind: 'market'; id: string }
  | { kind: 'markets' }
  | { kind: 'technology' }
  | { kind: 'integration' }
  | { kind: 'about' }
  | { kind: 'contact' }
  | { kind: 'sample' }
  | { kind: 'blog' }
  | { kind: 'article'; slug: string }
  | { kind: 'press' }
  | { kind: 'legal'; slug: string };

type Locale = 'fr' | 'en';
type NavigateFn = (path: string, locale?: Locale) => void;

const CONTACT_ITEMS = [
  { icon: MapPin, label: '20 rue Bouvier, 75011 Paris' },
  { icon: Phone, label: '+33 1 45 08 91 41' },
  { icon: Mail, label: 'contact@systemmag.com' },
];

const HERO_SPECS = [
  { label: 'Familles', value: 'Zip, bande, fourreau' },
  { label: 'Formats', value: 'BA-V04 à BA-V12' },
  { label: 'Sortie', value: 'prototype ou série' },
];

const PROOF_ITEMS = [
  {
    icon: Magnet,
    label: 'Maintien réparti',
    value: 'La force est construite sur une ligne magnétique, pas sur un point isolé.',
  },
  {
    icon: Ruler,
    label: 'Architecture définie',
    value: 'Format, rangs, polarités, couture et finition sont cadrés ensemble.',
  },
  {
    icon: ShieldCheck,
    label: 'Usage exigeant',
    value: 'Pensé pour les produits manipulés vite, sous contrainte ou avec précision limitée.',
  },
  {
    icon: Factory,
    label: 'Passage en série',
    value: 'Le prototype sert à stabiliser le geste avant production.',
  },
];

const BUYER_ROLES = [
  {
    team: 'Design produit',
    need: 'Préserver la ligne extérieure, la souplesse et la perception premium du geste.',
    output: 'Intégration invisible, finitions textiles, choix fourreau ou zip.',
  },
  {
    team: 'R&D / Bureau d’étude',
    need: 'Comprendre rapidement si le système peut répondre à une contrainte d’usage.',
    output: 'Architecture magnétique, format, rangs, polarités et premiers essais.',
  },
  {
    team: 'Production',
    need: 'Anticiper couture, montage, répétabilité, entretien et passage en série.',
    output: 'Méthode d’intégration, points de contrôle et validation du prototype.',
  },
  {
    team: 'Achat / Direction produit',
    need: 'Identifier la bonne famille, la valeur d’usage et le chemin vers un devis.',
    output: 'Catalogue, critères de choix, pages produits et contact expert.',
  },
];

const BUYER_PATHS = [
  {
    icon: Box,
    title: 'Choisir une famille',
    text: 'Identifier si le besoin relève d’une fermeture linéaire, d’un maintien réparti, d’un fourreau ou d’un développement spécifique.',
  },
  {
    icon: Layers3,
    title: 'Qualifier le support',
    text: 'Épaisseur, tension, courbure, lavage, couture et finition déterminent la bonne architecture magnétique.',
  },
  {
    icon: Clock3,
    title: 'Valider le geste',
    text: 'La solution est jugée sur la perception réelle : alignement, tenue, ouverture, bruit et répétition.',
  },
];

const QUALIFICATION_POINTS = [
  {
    label: '01',
    title: 'Usage',
    question: 'Qui ouvre, avec quelle précision, dans quel environnement ?',
    answer: 'Défense, médical, sport, mode ou industrie n’imposent pas la même sensation d’ouverture.',
  },
  {
    label: '02',
    title: 'Support',
    question: 'Textile souple, support épais, rabat, poche, courbe ou bord technique ?',
    answer: 'Le patronage, l’épaisseur et la tension déterminent le mode de montage.',
  },
  {
    label: '03',
    title: 'Force',
    question: 'Faut-il guider, maintenir, sécuriser ou simplement faciliter le geste ?',
    answer: 'Largeur, rangs, polarités et distance entre points définissent la force utile.',
  },
  {
    label: '04',
    title: 'Série',
    question: 'Prototype unique, présérie, équipement récurrent ou gamme produit ?',
    answer: 'La validation fixe la répétabilité, les tolérances et les échanges production.',
  },
];

const HEADER_COPY = {
  fr: {
    technology: 'Technologie',
    products: 'Produits',
    markets: 'Marchés',
    integration: 'Savoir-faire',
    catalogue: 'Catalogue technique',
    resources: 'Ressources',
    enterprise: 'Entreprise',
    contact: 'Contact',
    talk: 'Parler à un expert',
    language: 'Langue du site',
  },
  en: {
    technology: 'Technology',
    products: 'Products',
    markets: 'Markets',
    integration: 'Know-how',
    catalogue: 'Technical catalogue',
    resources: 'Resources',
    enterprise: 'Company',
    contact: 'Contact',
    talk: 'Talk to an expert',
    language: 'Site language',
  },
} satisfies Record<Locale, Record<string, string>>;

const LANGUAGE_OPTIONS: Array<{ code: Locale; label: string; name: string }> = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
];

const DEFAULT_LOCALE: Locale = 'fr';
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

const stripLanguagePrefix = (path: string) => path.replace(/^\/(?:fr|en)(?=\/|$)/, '') || '/';

const getLocaleFromPath = (path?: string): Locale => {
  const source = path ?? (typeof window === 'undefined' ? `/${DEFAULT_LOCALE}` : window.location.pathname);
  return /^\/en(?=\/|$)/.test(source) ? 'en' : 'fr';
};

const getContentPath = (path?: string) => {
  const source = path ?? (typeof window === 'undefined' ? '/' : window.location.pathname);
  return stripLanguagePrefix(source.replace(/\/+$/, '') || '/');
};

const localPath = (path: string, locale: Locale = getLocaleFromPath()) => `/${locale}${path === '/' ? '' : path}`;

const pathForLocale = (path: string, locale: Locale) => {
  const contentPath = stripLanguagePrefix(path).replace(/\/+$/, '') || '/';
  if (contentPath === '/') return '/';
  const segments = contentPath.split('/').filter(Boolean);
  const first = segments[0];
  const localizedFirst = locale === 'en'
    ? ({ produits: 'products', marches: 'markets', 'marchés': 'markets', technologie: 'technology', ressources: 'blog', entreprise: 'about', histoire: 'about', 'savoir-faire': 'integration', echantillon: 'sample', presse: 'press' }[first] ?? first)
    : ({ products: 'produits', markets: 'marches', technology: 'technology', resources: 'blog', company: 'about', sample: 'echantillon', press: 'press' }[first] ?? first);
  return `/${[localizedFirst, ...segments.slice(1)].join('/')}`;
};

const productPath = (product: ProductFamily, locale: Locale = getLocaleFromPath()) => (
  `${locale === 'en' ? '/products' : '/produits'}/${product.id}`
);
const marketPath = (market: Market, locale: Locale = getLocaleFromPath()) => (
  `${locale === 'en' ? '/markets' : '/marches'}/${market.id}`
);

const translateText = (text: string, locale: Locale) => (locale === 'en' ? EN_TRANSLATIONS[text] ?? text : text);

const translateDeep = <T,>(value: T, locale: Locale): T => {
  if (locale === 'fr') return value;
  if (typeof value === 'string') return translateText(value, locale) as T;
  if (Array.isArray(value)) return value.map((item) => translateDeep(item, locale)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, translateDeep(entry, locale)]),
    ) as T;
  }
  return value;
};

const CONTENT_SOURCE = {
  contactItems: CONTACT_ITEMS,
  heroSpecs: HERO_SPECS,
  proofItems: PROOF_ITEMS,
  buyerRoles: BUYER_ROLES,
  buyerPaths: BUYER_PATHS,
  qualificationPoints: QUALIFICATION_POINTS,
  technologySteps: TECHNOLOGY_STEPS,
  products: PRODUCTS,
  baFormats: BA_FORMATS,
  markets: MARKETS,
  processSteps: PROCESS_STEPS,
  trustBadges: TRUST_BADGES,
  technologyCapabilities: TECHNOLOGY_CAPABILITIES,
  technologyComparison: TECHNOLOGY_COMPARISON,
  productDecisionPaths: PRODUCT_DECISION_PATHS,
  aboutTimeline: ABOUT_TIMELINE,
  pressItems: PRESS_ITEMS,
  blogPosts: BLOG_POSTS,
  legalPages: LEGAL_PAGES,
};

type SystemmagContent = typeof CONTENT_SOURCE;

const getLocalizedContent = (locale: Locale): SystemmagContent => translateDeep(CONTENT_SOURCE, locale);
const useLocale = () => useContext(LocaleContext);
const useText = () => {
  const locale = useLocale();
  return (text: string) => translateText(text, locale);
};
const useLocalizedContent = () => {
  const locale = useLocale();
  return useMemo(() => getLocalizedContent(locale), [locale]);
};

const resolveProductFrom = (products: ProductFamily[], id: string) => (
  products.find((product) => product.id === id || product.aliases?.includes(id)) ?? products[0]
);

const resolveMarketFrom = (markets: Market[], id: string) => (
  markets.find((market) => market.id === id || market.aliases?.includes(id)) ?? markets[0]
);

const resolveArticleFrom = (posts: BlogPost[], slug: string) => posts.find((post) => post.slug === slug) ?? posts[0];
const resolveLegalPageFrom = (pages: LegalPage[], slug: string) => pages.find((page) => page.slug === slug) ?? pages[0];

const parseRoute = (): AppRoute => {
  const rawPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const path = stripLanguagePrefix(rawPath);
  const productMatch = path.match(/^\/(?:produits|products)\/(.+)$/);
  const marketMatch = path.match(/^\/(?:marches|marchés|markets)\/([^/]+)$/);
  const articleMatch = path.match(/^\/blog\/([^/]+)$/);
  const legalMatch = path.match(/^\/(legal|privacy)$/);

  if (path === '/' || path === '') return { kind: 'home' };
  if (path === '/technology' || path === '/technologie') return { kind: 'technology' };
  if (path === '/products' || path === '/produits') return { kind: 'products' };
  if (productMatch) return { kind: 'product', id: decodeURIComponent(productMatch[1].split('/').pop() ?? '') };
  if (path === '/markets' || path === '/marches' || path === '/marchés') return { kind: 'markets' };
  if (marketMatch) return { kind: 'market', id: decodeURIComponent(marketMatch[1]) };
  if (path === '/integration' || path === '/savoir-faire') return { kind: 'integration' };
  if (path === '/about' || path === '/entreprise' || path === '/histoire') return { kind: 'about' };
  if (path === '/contact') return { kind: 'contact' };
  if (path === '/echantillon' || path === '/sample') return { kind: 'sample' };
  if (path === '/blog' || path === '/ressources') return { kind: 'blog' };
  if (articleMatch) return { kind: 'article', slug: decodeURIComponent(articleMatch[1]) };
  if (path === '/press' || path === '/presse') return { kind: 'press' };
  if (legalMatch) return { kind: 'legal', slug: legalMatch[1] };
  return { kind: 'home' };
};

const pageTitle = (route: AppRoute, locale: Locale): string => {
  const content = getLocalizedContent(locale);
  if (route.kind === 'product') return `${resolveProductFrom(content.products, route.id).title} — ${APP_NAME}`;
  if (route.kind === 'market') return `${resolveMarketFrom(content.markets, route.id).title} — ${APP_NAME}`;
  if (route.kind === 'technology') return `${translateText('Technologie', locale)} — ${APP_NAME}`;
  if (route.kind === 'products') return `${translateText('Produits', locale)} — ${APP_NAME}`;
  if (route.kind === 'markets') return `${translateText('Marchés', locale)} — ${APP_NAME}`;
  if (route.kind === 'integration') return `${translateText('Savoir-faire', locale)} — ${APP_NAME}`;
  if (route.kind === 'blog') return `${translateText('Ressources', locale)} — ${APP_NAME}`;
  if (route.kind === 'article') return `${resolveArticleFrom(content.blogPosts, route.slug).title} — ${APP_NAME}`;
  if (route.kind === 'contact') return `${translateText('Contact', locale)} — ${APP_NAME}`;
  return `${APP_NAME} — ${translateText('La fermeture magnétique conçue pour disparaître', locale)}`;
};

const pageDescription = (route: AppRoute, locale: Locale): string => {
  const content = getLocalizedContent(locale);
  if (route.kind === 'product') {
    const product = resolveProductFrom(content.products, route.id);
    return `${product.title} SYSTEMMAG : ${product.summary}`;
  }
  if (route.kind === 'market') {
    const market = resolveMarketFrom(content.markets, route.id);
    return `${market.title} : ${market.headline} ${translateText('Applications, contraintes et produits SYSTEMMAG recommandés.', locale)}`;
  }
  if (route.kind === 'technology') {
    return translateText('Principe SYSTEMMAG : auto-positionnement, maintien réparti, ouverture par pelage et intégration textile.', locale);
  }
  if (route.kind === 'products') {
    return translateText('Catalogue SYSTEMMAG : zips magnétiques, bandes et blocs d’aimants, fourreaux et bureau d’étude pour intégration textile.', locale);
  }
  if (route.kind === 'markets') {
    return translateText('Marchés SYSTEMMAG : défense, sport extrême, médical, mode, industrie technique et mobilité réduite.', locale);
  }
  if (route.kind === 'integration') {
    return translateText('Savoir-faire SYSTEMMAG : cadrage, architecture magnétique, prototype et validation série.', locale);
  }
  if (route.kind === 'blog' || route.kind === 'article') {
    return translateText('Ressources SYSTEMMAG pour comprendre et cadrer une fermeture magnétique textile.', locale);
  }
  return translateText('SYSTEMMAG conçoit des fermetures magnétiques invisibles intégrées aux textiles, accessoires et équipements techniques.', locale);
};

const setMetaContent = (selector: string, content: string) => {
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = content;
};

const useScrollSystems = (route: AppRoute, locale: Locale) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.82,
      touchMultiplier: 1,
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const title = pageTitle(route, locale);
    const description = pageDescription(route, locale);
    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [route, locale]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        if (element.closest('.home-hero, .page-intro, .product-detail-hero, .market-detail-hero, .contact-page')) {
          return;
        }

        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.parallax-media').forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: -3 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    });

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [route, locale]);
};

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(() => parseRoute());
  const [locale, setLocale] = useState<Locale>(() => getLocaleFromPath());

  useScrollSystems(route, locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute());
      setLocale(getLocaleFromPath());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate: NavigateFn = (path, nextLocale = getLocaleFromPath()) => {
    const target = localPath(path, nextLocale);
    if (window.location.pathname === target) return;
    window.history.pushState(null, '', target);
    setRoute(parseRoute());
    setLocale(getLocaleFromPath());
  };

  return (
    <LocaleContext.Provider value={locale}>
      <SiteShell route={route} navigate={navigate} locale={locale}>
        <AnimatePresence mode="wait">
          <motion.main
            key={`${route.kind}${'id' in route ? route.id : ''}${'slug' in route ? route.slug : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <RouteRenderer route={route} navigate={navigate} />
          </motion.main>
        </AnimatePresence>
      </SiteShell>
    </LocaleContext.Provider>
  );
};

const RouteRenderer: React.FC<{ route: AppRoute; navigate: NavigateFn }> = ({ route, navigate }) => {
  if (route.kind === 'home') return <HomePage navigate={navigate} />;
  if (route.kind === 'technology') return <TechnologyPage navigate={navigate} />;
  if (route.kind === 'products') return <ProductsPage navigate={navigate} />;
  if (route.kind === 'product') return <ProductPage productId={route.id} navigate={navigate} />;
  if (route.kind === 'markets') return <MarketsPage navigate={navigate} />;
  if (route.kind === 'market') return <MarketPage marketId={route.id} navigate={navigate} />;
  if (route.kind === 'integration') return <IntegrationPage navigate={navigate} />;
  if (route.kind === 'about') return <AboutPage navigate={navigate} />;
  if (route.kind === 'contact') return <ContactPage navigate={navigate} />;
  if (route.kind === 'sample') return <SamplePage navigate={navigate} />;
  if (route.kind === 'blog') return <BlogPage navigate={navigate} />;
  if (route.kind === 'article') return <ArticlePage slug={route.slug} navigate={navigate} />;
  if (route.kind === 'press') return <PressPage navigate={navigate} />;
  if (route.kind === 'legal') return <LegalPage slug={route.slug} navigate={navigate} />;
  return <HomePage navigate={navigate} />;
};

const SiteShell: React.FC<{ children: React.ReactNode; route: AppRoute; navigate: NavigateFn; locale: Locale }> = ({
  children,
  route,
  navigate,
  locale,
}) => (
  <>
    <Header route={route} navigate={navigate} locale={locale} />
    {children}
    <Footer navigate={navigate} />
  </>
);

const SmartLink: React.FC<{
  to: string;
  navigate: NavigateFn;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>> = ({
  to,
  navigate,
  className,
  children,
  onClick,
  ...rest
}) => {
  const locale = useLocale();
  const targetPath = pathForLocale(to, locale);

  return (
    <a
      href={localPath(targetPath, locale)}
      className={className}
      {...rest}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
        navigate(targetPath, locale);
      }}
    >
      {children}
    </a>
  );
};

const LanguageSwitch: React.FC<{ locale: Locale; navigate: NavigateFn; onChange?: () => void }> = ({
  locale,
  navigate,
  onChange,
}) => {
  const currentPath = getContentPath();

  return (
    <div className="language-switch" role="group" aria-label={HEADER_COPY[locale].language}>
      {LANGUAGE_OPTIONS.map((option) => (
        <a
          key={option.code}
          href={localPath(pathForLocale(currentPath, option.code), option.code)}
          className={option.code === locale ? 'active' : ''}
          aria-current={option.code === locale ? 'true' : undefined}
          aria-label={option.name}
          onClick={(event) => {
            event.preventDefault();
            onChange?.();
            navigate(pathForLocale(currentPath, option.code), option.code);
          }}
        >
          {option.label}
        </a>
      ))}
    </div>
  );
};

const Header: React.FC<{ route: AppRoute; navigate: NavigateFn; locale: Locale }> = ({ route, navigate, locale }) => {
  const [mega, setMega] = useState<'products' | 'markets' | 'resources' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const copy = HEADER_COPY[locale];

  const closeAll = () => {
    setMega(null);
    setMobileOpen(false);
  };

  return (
    <header className="site-header" onMouseLeave={() => setMega(null)}>
      <div className="header-bar">
        <SmartLink to="/" navigate={navigate} className="brand-lockup" onClick={closeAll}>
          <img src="/images/logo-systemmag.png" alt="SYSTEMMAG" />
        </SmartLink>

        <nav className="desktop-nav" aria-label="Navigation principale">
          <SmartLink
            to="/technology"
            navigate={navigate}
            className={route.kind === 'technology' ? 'nav-link active' : 'nav-link'}
          >
            {copy.technology}
          </SmartLink>
          <SmartLink
            to="/marches"
            navigate={navigate}
            className={route.kind === 'markets' || route.kind === 'market' ? 'nav-link active' : 'nav-link'}
            onMouseEnter={() => setMega('markets')}
            onFocus={() => setMega('markets')}
            aria-haspopup="menu"
            aria-expanded={mega === 'markets'}
          >
            {copy.markets} <ChevronDown size={14} />
          </SmartLink>
          <SmartLink
            to="/produits"
            navigate={navigate}
            className={route.kind === 'products' || route.kind === 'product' ? 'nav-link active' : 'nav-link'}
            onMouseEnter={() => setMega('products')}
            onFocus={() => setMega('products')}
            aria-haspopup="menu"
            aria-expanded={mega === 'products'}
          >
            {copy.products} <ChevronDown size={14} />
          </SmartLink>
          <SmartLink to="/integration" navigate={navigate} className={route.kind === 'integration' ? 'nav-link active' : 'nav-link'}>
            {copy.integration}
          </SmartLink>
          <a className="nav-link" href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer">
            {copy.catalogue}
          </a>
        </nav>

        <div className="header-actions">
          <LanguageSwitch locale={locale} navigate={navigate} onChange={closeAll} />
          <SmartLink to="/contact" navigate={navigate} className="primary-action">
            {copy.talk} <ArrowRight size={17} />
          </SmartLink>
          <button className="mobile-menu-button" aria-label="Menu" onClick={() => setMobileOpen((value) => !value)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mega && (
          <motion.div
            className="mega-panel"
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.985 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setMega(mega)}
          >
            {mega === 'products' && <ProductsMega navigate={navigate} close={closeAll} />}
            {mega === 'markets' && <MarketsMega navigate={navigate} close={closeAll} />}
            {mega === 'resources' && <ResourcesMega navigate={navigate} close={closeAll} />}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            {[
              [copy.technology, '/technology'],
              [copy.products, '/produits'],
              [copy.markets, '/marches'],
              [copy.integration, '/integration'],
              [copy.resources, '/blog'],
              [copy.enterprise, '/about'],
              [copy.contact, '/contact'],
            ].map(([label, path]) => (
              <SmartLink key={path} to={path} navigate={navigate} onClick={closeAll}>
                {label}
              </SmartLink>
            ))}
            <a href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer" onClick={closeAll}>
              {copy.catalogue}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

const ProductsMega: React.FC<{ navigate: NavigateFn; close: () => void }> = ({ navigate, close }) => {
  const t = useText();
  const { products } = useLocalizedContent();

  return (
    <div className="mega-grid">
      <div>
        <p className="mega-title">{t('Familles de produits')}</p>
        <p className="mega-copy">{t('Choisir une fermeture, un module ou une intégration selon le geste attendu.')}</p>
      </div>
      <div className="mega-list">
        {products.map((product) => (
          <SmartLink key={product.id} to={productPath(product)} navigate={navigate} onClick={close} className="mega-item">
            <span>{product.number}</span>
            <strong>{product.title}</strong>
            <small>{product.summary}</small>
          </SmartLink>
        ))}
      </div>
    </div>
  );
};

const MarketsMega: React.FC<{ navigate: NavigateFn; close: () => void }> = ({ navigate, close }) => {
  const t = useText();
  const { markets } = useLocalizedContent();

  return (
    <div className="mega-grid">
      <div>
        <p className="mega-title">{t('Applications')}</p>
        <p className="mega-copy">{t('Des usages où le geste, la discrétion et la fiabilité comptent.')}</p>
      </div>
      <div className="mega-list mega-list-two">
        {markets.map((market) => (
          <SmartLink key={market.id} to={marketPath(market)} navigate={navigate} onClick={close} className="mega-item">
            <span>{market.title}</span>
            <small>{market.description}</small>
          </SmartLink>
        ))}
      </div>
    </div>
  );
};

const ResourcesMega: React.FC<{ navigate: NavigateFn; close: () => void }> = ({ navigate, close }) => {
  const t = useText();

  return (
    <div className="mega-grid">
      <div>
        <p className="mega-title">{t('Documentation')}</p>
        <p className="mega-copy">{t('Comprendre le principe, cadrer un projet et préparer un échange technique.')}</p>
      </div>
      <div className="mega-list mega-list-two">
        <a href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer" className="mega-item" onClick={close}>
          <span>PDF</span>
          <strong>{t('Catalogue technique')}</strong>
          <small>{t('Formats, familles et premières indications d’intégration.')}</small>
        </a>
        <SmartLink to="/blog" navigate={navigate} onClick={close} className="mega-item">
          <span>{t('Articles')}</span>
          <strong>{t('Ressources')}</strong>
          <small>{t('Guides de cadrage, technologie textile et usages.')}</small>
        </SmartLink>
        <SmartLink to="/press" navigate={navigate} onClick={close} className="mega-item">
          <span>{t('Presse')}</span>
          <strong>{t('Revue media')}</strong>
          <small>{t('Historique public et mentions de SYSTEMMAG.')}</small>
        </SmartLink>
        <SmartLink to="/about" navigate={navigate} onClick={close} className="mega-item">
          <span>{t('Entreprise')}</span>
          <strong>{t('Histoire et atelier')}</strong>
          <small>{t('Origine parisienne, brevets et savoir-faire industriel.')}</small>
        </SmartLink>
        <SmartLink to="/echantillon" navigate={navigate} onClick={close} className="mega-item">
          <span>{t('Projet')}</span>
          <strong>{t('Demande d’échantillon')}</strong>
          <small>{t('Qualifier un usage et préparer un premier essai.')}</small>
        </SmartLink>
      </div>
    </div>
  );
};

const PageIntro: React.FC<{
  label?: string;
  title: string;
  copy: string;
  image?: string;
  actions?: React.ReactNode;
}> = ({ label, title, copy, image, actions }) => (
  <section className="page-intro">
    <div className="intro-copy reveal">
      {label && <p className="section-label">{label}</p>}
      <h1>{title}</h1>
      <p>{copy}</p>
      {actions && <div className="intro-actions">{actions}</div>}
    </div>
    {image && (
      <figure className="intro-media reveal">
        <img src={image} alt="" />
      </figure>
    )}
  </section>
);

const HomePage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const content = useLocalizedContent();
  const [activeMarketId, setActiveMarketId] = useState(MARKETS[0].id);
  const [activeTechId, setActiveTechId] = useState(TECHNOLOGY_STEPS[0].id);
  const activeMarket = resolveMarketFrom(content.markets, activeMarketId);
  const activeTech = content.technologySteps.find((step) => step.id === activeTechId) ?? content.technologySteps[0];

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy reveal">
          <span className="version-mark">[ v.01b ]</span>
          <h1>
            <span>{t('Fermeture')}</span>
            <span className="accent">{t('magnétique')}</span>
            <span>{t('invisible')}</span>
          </h1>
          <p>
            {t('Systèmes magnétiques intégrés aux textiles, accessoires et équipements techniques pour créer des fermetures discrètes, souples et adaptées à vos contraintes d’usage.')}
          </p>
          <div className="hero-actions">
            <SmartLink to="/technology" navigate={navigate} className="hero-tech-link">
              {t('Explorer la technologie')} <ArrowUpRight size={16} />
            </SmartLink>
          </div>
        </div>

        <div className="hero-media-wrap reveal">
          <figure className="hero-media parallax-media">
            <img src="/images/hero-integrated-markets.png" alt="Détail original d’une fermeture magnétique textile Systemmag" />
          </figure>
          <div className="hero-spec-card">
            <span>{t('Détails techniques')}</span>
            <div>
              <small>{t('Principe')}</small>
              <strong>{t('Auto-positionnement')}</strong>
            </div>
            <div>
              <small>{t('Familles')}</small>
              <strong>{t('Zip, bande, fourreau')}</strong>
            </div>
            <div>
              <small>{t('Intégration')}</small>
              <strong>{t('Couture / fourreau')}</strong>
            </div>
            <div>
              <small>{t('Sortie')}</small>
              <strong>{t('prototype ou série')}</strong>
            </div>
            <SmartLink to="/technology" navigate={navigate}>
              {t('Voir les détails')} <ArrowUpRight size={13} />
            </SmartLink>
          </div>
          <div className="hero-frame-count">[ 001 / 005 ]</div>
        </div>
      </section>

      <TrustStrip />
      <CredibilityBand navigate={navigate} />

      <section className="section split-section" id="technology">
        <div className="section-copy reveal">
          <p className="section-label">{t('Technologie')}</p>
          <h2>{t('Une fermeture qui se positionne, maintient et s’ouvre naturellement.')}</h2>
          <p>
            {t('Le système répartit la force dans le textile : l’utilisateur rapproche les deux parties, les polarités s’alignent, puis l’ouverture se fait par pelage, aimant après aimant.')}
          </p>
          <SmartLink to="/technology" navigate={navigate} className="text-link">
            {t('Découvrir le principe')} <ArrowRight size={16} />
          </SmartLink>
        </div>

        <div className="mechanism-board reveal">
          <div className="mechanism-image">
            <img src={activeTech.image} alt={activeTech.title} />
          </div>
          <div className="mechanism-steps">
            {content.technologySteps.map((step) => (
              <button
                key={step.id}
                className={step.id === activeTech.id ? 'mechanism-step active' : 'mechanism-step'}
                onMouseEnter={() => setActiveTechId(step.id)}
                onFocus={() => setActiveTechId(step.id)}
                onClick={() => setActiveTechId(step.id)}
              >
                <span>{String(step.id).padStart(2, '0')}</span>
                <strong>{step.title}</strong>
                <small>{step.description}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section product-system" id="products">
        <div className="section-head reveal">
          <div>
            <p className="section-label">{t('Produits')}</p>
            <h2>{t('Familles produits pour composer votre fermeture.')}</h2>
            <p className="section-deck">
              {t('Un catalogue court, lisible par les équipes produit, R&D et production : le composant est toujours relié au geste et au mode d’intégration.')}
            </p>
          </div>
          <SmartLink to="/produits" navigate={navigate} className="secondary-action dark">
            {t('Tous les produits')} <ArrowRight size={17} />
          </SmartLink>
        </div>
        <div className="product-rows">
          {content.products.map((product) => (
            <SmartLink key={product.id} to={productPath(product)} navigate={navigate} className="product-row reveal">
              <span className="row-number">{product.number}</span>
              <span className="row-image">
                <img src={product.image} alt={product.title} />
              </span>
              <span className="row-main">
                <strong>{product.title}</strong>
                <small>{product.summary}</small>
              </span>
              <span className="row-specs">
                {product.specs.slice(0, 3).map((spec) => (
                  <em key={spec}>{spec}</em>
                ))}
              </span>
              <ArrowUpRight size={20} />
            </SmartLink>
          ))}
        </div>
      </section>

      <section className="section markets-section" id="markets">
        <div className="market-stage reveal" style={{ backgroundImage: `url(${activeMarket.image})` }}>
          <div>
            <p className="section-label light">{t('Marchés')}</p>
            <h2>{t('Conçu pour les produits où le geste ne doit pas échouer.')}</h2>
            <p>{activeMarket.headline}</p>
            <SmartLink to={marketPath(activeMarket)} navigate={navigate} className="primary-action">
              {t('Voir')} {activeMarket.title} <ArrowRight size={17} />
            </SmartLink>
          </div>
        </div>
        <div className="market-list reveal">
          {content.markets.map((market, index) => (
            <SmartLink
              key={market.id}
              to={marketPath(market)}
              navigate={navigate}
              className={market.id === activeMarket.id ? 'market-row active' : 'market-row'}
              onMouseEnter={() => setActiveMarketId(market.id)}
              onFocus={() => setActiveMarketId(market.id)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{market.title}</strong>
              <small>{market.description}</small>
            </SmartLink>
          ))}
        </div>
      </section>

      <section className="section architecture-section">
        <div className="architecture-panel reveal">
          <div>
            <p className="section-label light">{t('Architecture')}</p>
            <h2>{t('Un choix de fermeture commence par la contrainte d’usage.')}</h2>
            <p>
              {t('La bonne réponse n’est pas seulement un format d’aimant. C’est un équilibre entre support, force, finition, manipulation et industrialisation.')}
            </p>
          </div>
          <SmartLink to="/integration" navigate={navigate} className="secondary-action inverted">
            {t('Parler intégration')} <ArrowRight size={16} />
          </SmartLink>
        </div>
        <div className="buyer-path-grid">
          {content.buyerPaths.map(({ icon: Icon, title, text }) => (
            <article key={title} className="buyer-path reveal">
              <Icon size={22} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="decision-grid">
          {content.productDecisionPaths.map((path, index) => (
            <article key={path.title} className="decision-card reveal">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{path.title}</h3>
              <p>{path.text}</p>
              <strong>{path.target}</strong>
            </article>
          ))}
        </div>
      </section>

      <QualificationSection navigate={navigate} />
      <ProcessPreview navigate={navigate} />
      <ResourcesPreview navigate={navigate} />
      <FinalCta navigate={navigate} />
    </>
  );
};

const TrustStrip: React.FC = () => (
  <TrustStripContent />
);

const TrustStripContent: React.FC = () => {
  const t = useText();
  const { proofItems } = useLocalizedContent();

  return (
    <section className="trust-strip">
      <div className="trust-lead">
        <span>{t('Engineered performance')}</span>
        <strong>{t('Preuve technique avant effet visuel.')}</strong>
      </div>
      {proofItems.map(({ icon: Icon, label, value }) => (
        <article key={label}>
          <Icon size={27} />
          <strong>{label}</strong>
          <span>{value}</span>
        </article>
      ))}
    </section>
  );
};

const CredibilityBand: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <CredibilityBandContent navigate={navigate} />
);

const CredibilityBandContent: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { trustBadges } = useLocalizedContent();

  return (
    <section className="credibility-band">
      <div className="credibility-copy reveal">
        <p className="section-label light">{t('Preuves industrielles')}</p>
        <h2>{t('Un système discret, mais une décision technique complète.')}</h2>
        <p>
          {t('La fermeture magnétique n’est pas traitée comme un accessoire décoratif. Chaque projet est cadré autour du geste, du support, de la force utile, de la finition visible et du passage en série.')}
        </p>
        <div className="credibility-actions">
          <SmartLink to="/integration" navigate={navigate} className="secondary-action inverted">
            {t('Voir la méthode')} <ArrowRight size={16} />
          </SmartLink>
          <a className="text-link light-link" href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer">
            {t('Catalogue technique')} <Download size={16} />
          </a>
        </div>
      </div>

      <div className="credibility-badges reveal">
        {trustBadges.map((badge) => (
          <article key={badge.label}>
            <strong>{badge.label}</strong>
            <span>{badge.value}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

const QualificationSection: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <QualificationSectionContent navigate={navigate} />
);

const QualificationSectionContent: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { qualificationPoints, buyerRoles } = useLocalizedContent();

  return (
    <section className="section qualification-section">
      <div className="qualification-intro reveal">
        <p className="section-label">{t('Qualification')}</p>
        <h2>{t('Le bon choix commence par les contraintes du produit.')}</h2>
        <p>
          {t('Une page professionnelle doit aider l’acheteur à se situer avant le premier échange. SYSTEMMAG guide le choix entre zip, bande, fourreau ou développement spécifique en partant de critères concrets.')}
        </p>
        <SmartLink to="/contact" navigate={navigate} className="primary-action">
          {t('Qualifier un projet')} <ArrowRight size={17} />
        </SmartLink>
      </div>

      <div className="qualification-table reveal">
        {qualificationPoints.map((point) => (
          <article key={point.label}>
            <span>{point.label}</span>
            <strong>{point.title}</strong>
            <p>{point.question}</p>
            <small>{point.answer}</small>
          </article>
        ))}
      </div>

      <div className="buyer-role-rail reveal">
        {buyerRoles.map((role) => (
          <article key={role.team}>
            <span>{role.team}</span>
            <p>{role.need}</p>
            <strong>{role.output}</strong>
          </article>
        ))}
      </div>
    </section>
  );
};

const ProcessPreview: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <ProcessPreviewContent navigate={navigate} />
);

const ProcessPreviewContent: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { processSteps } = useLocalizedContent();

  return (
    <section className="section process-preview" id="integration">
      <div className="section-copy reveal">
        <p className="section-label">{t('Du prototype à la série')}</p>
        <h2>{t('Un accompagnement pour transformer une idée de fermeture en solution industrialisable.')}</h2>
        <p>
          {t('La valeur de Systemmag est autant dans le composant que dans son intégration : force, textile, couture, finition, lavage, usage et volume sont cadrés ensemble.')}
        </p>
      </div>
      <div className="process-track">
        {processSteps.map((step) => (
          <article key={step.id} className="process-card reveal">
            <img src={step.image} alt="" />
            <span>{String(step.id).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
      <SmartLink to="/integration" navigate={navigate} className="secondary-action dark reveal">
        {t('Voir le savoir-faire')} <ArrowRight size={17} />
      </SmartLink>
    </section>
  );
};

const ResourcesPreview: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <ResourcesPreviewContent navigate={navigate} />
);

const ResourcesPreviewContent: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { blogPosts } = useLocalizedContent();

  return (
    <section className="section resources-preview">
      <div className="section-head reveal">
        <div>
          <p className="section-label">{t('Ressources')}</p>
          <h2>{t('De la documentation pour avancer avec vos équipes.')}</h2>
        </div>
        <SmartLink to="/blog" navigate={navigate} className="text-link">
          {t('Toutes les ressources')} <ArrowRight size={16} />
        </SmartLink>
      </div>
      <div className="resource-grid">
        {blogPosts.map((post) => (
          <SmartLink key={post.slug} to={`/blog/${post.slug}`} navigate={navigate} className="resource-card reveal">
            <img src={post.coverImage} alt="" />
            <span>{post.category}</span>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </SmartLink>
        ))}
      </div>
    </section>
  );
};

const FinalCta: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <FinalCtaContent navigate={navigate} />
);

const FinalCtaContent: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();

  return (
    <section className="final-cta reveal">
      <div>
        <h2>{t('Une question technique ou un projet à cadrer ?')}</h2>
        <p>{t('Présentez votre produit, votre contrainte d’usage ou votre besoin d’échantillon.')}</p>
      </div>
      <div className="cta-actions">
        <SmartLink to="/contact" navigate={navigate} className="primary-action large">
          {t('Parler à un expert')} <ArrowRight size={18} />
        </SmartLink>
        <SmartLink to="/echantillon" navigate={navigate} className="secondary-action dark">
          {t('Demander un échantillon')}
        </SmartLink>
      </div>
    </section>
  );
};

const ProductsPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { products, baFormats } = useLocalizedContent();

  return (
    <>
      <PageIntro
        label={t('Produits')}
        title={t('Un catalogue court, pensé pour l’intégration.')}
        copy={t('Systemmag propose des familles de composants et un bureau d’étude pour adapter la fermeture magnétique au produit final.')}
        image="/images/cinematic-product-theatre-v3.png"
        actions={
          <>
            <a className="primary-action" href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer">
              {t('Télécharger le catalogue')} <Download size={17} />
            </a>
            <SmartLink to="/contact" navigate={navigate} className="secondary-action dark">
              {t('Parler à un expert')}
            </SmartLink>
          </>
        }
      />
      <section className="section catalogue-grid-section">
        <div className="catalogue-grid">
          {products.map((product) => (
            <ProductCatalogueCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>
      </section>
      <section className="section formats-section">
        <div className="section-head reveal">
          <div>
            <p className="section-label">{t('Formats BA')}</p>
            <h2>{t('Bandes aimantées disponibles pour cadrer la force.')}</h2>
          </div>
        </div>
        <div className="format-grid">
          {baFormats.map((format) => (
            <article key={format.id} className="format-card reveal">
              <img src={format.image} alt={format.title} />
              <h3>{format.title}</h3>
              <p>{format.meta}</p>
            </article>
          ))}
        </div>
      </section>
      <FinalCta navigate={navigate} />
    </>
  );
};

const ProductCatalogueCard: React.FC<{ product: ProductFamily; navigate: NavigateFn }> = ({ product, navigate }) => {
  const t = useText();

  return (
    <article className="catalogue-card reveal">
      <div className="catalogue-media">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="catalogue-content">
        <span>{product.number}</span>
        <h2>{product.title}</h2>
        <p>{product.summary}</p>
        <ul>
          {product.specs.map((spec) => (
            <li key={spec}>
              <Check size={15} /> {spec}
            </li>
          ))}
        </ul>
        <SmartLink to={productPath(product)} navigate={navigate} className="text-link">
          {t('Voir la famille')} <ArrowRight size={16} />
        </SmartLink>
      </div>
    </article>
  );
};

const ProductPage: React.FC<{ productId: string; navigate: NavigateFn }> = ({ productId, navigate }) => {
  const t = useText();
  const { products } = useLocalizedContent();
  const product = resolveProductFrom(products, productId);
  const galleryImages = useMemo(() => Array.from(new Set([product.image, ...product.gallery])), [product]);
  const [activeImage, setActiveImage] = useState(galleryImages[0] ?? product.image);

  useEffect(() => {
    setActiveImage(galleryImages[0] ?? product.image);
  }, [galleryImages, product.image]);

  return (
    <>
      <section className="product-detail-hero">
        <aside className="product-sidebar reveal">
          <p>{t('Produits')}</p>
          {products.map((item) => (
            <SmartLink
              key={item.id}
              to={productPath(item)}
              navigate={navigate}
              className={item.id === product.id ? 'active' : ''}
            >
              {item.title}
            </SmartLink>
          ))}
          <a href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer">
            <FileText size={17} /> {t('Catalogue technique')}
          </a>
        </aside>

        <div className="product-hero-copy reveal">
          <SmartLink to="/produits" navigate={navigate} className="back-link">
            <ChevronLeft size={16} /> {t('Produits')}
          </SmartLink>
          <span className="section-label">{product.label}</span>
          <h1>{product.title}</h1>
          <p>{product.detailIntro}</p>
          <div className="hero-actions">
            <SmartLink to="/contact" navigate={navigate} className="primary-action">
              {t('Parler à un expert')} <ArrowRight size={17} />
            </SmartLink>
            <SmartLink to="/echantillon" navigate={navigate} className="secondary-action dark">
              {t('Demander un échantillon')}
            </SmartLink>
          </div>
          <div className="product-hero-specs">
            {product.specs.map((spec) => (
              <span key={spec}>{spec}</span>
            ))}
          </div>
        </div>

        <div className="product-gallery reveal">
          <figure>
            <img src={activeImage} alt={product.title} />
          </figure>
          <div className="gallery-thumbs">
            {galleryImages.slice(0, 5).map((image, index) => (
              <button key={`${product.id}-${index}-${image}`} className={image === activeImage ? 'active' : ''} onClick={() => setActiveImage(image)}>
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section product-proof">
        {product.proofPoints?.map((point) => (
          <article key={point.label} className="proof-card reveal">
            <span>{point.label}</span>
            <p>{point.value}</p>
          </article>
        ))}
      </section>

      <section className="section product-detail-layout">
        <div className="detail-main">
          <InfoBlock title={t('Applications')} items={product.useCases} />
          <InfoBlock title={t('Méthodes d’intégration')} items={product.integration} />
          <InfoBlock title={t('Contraintes cadrées')} items={product.constraints} />
        </div>
        <div className="variant-panel reveal">
          <h2>{t('Variantes disponibles')}</h2>
          {product.variants?.map((variant) => (
            <article key={variant.label}>
              <strong>{variant.label}</strong>
              <p>{variant.value}</p>
              <ArrowUpRight size={18} />
            </article>
          ))}
        </div>
      </section>

      <section className="section spec-section">
        <div className="section-head reveal">
          <div>
            <p className="section-label">{t('Spécifications')}</p>
            <h2>{t('Premiers repères techniques.')}</h2>
          </div>
        </div>
        <SpecTable rows={product.specificationRows} />
      </section>

      <FaqSection faq={product.faq ?? []} />
      <FinalCta navigate={navigate} />
    </>
  );
};

const InfoBlock: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <article className="info-block reveal">
    <h2>{title}</h2>
    <ul>
      {items.map((item) => (
        <li key={item}>
          <Check size={16} /> {item}
        </li>
      ))}
    </ul>
  </article>
);

const SpecTable: React.FC<{ rows: Array<{ label: string; value: string }> }> = ({ rows }) => (
  <div className="spec-table reveal">
    {rows.map((row) => (
      <div key={row.label}>
        <span>{row.label}</span>
        <strong>{row.value}</strong>
      </div>
    ))}
  </div>
);

const MarketsPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <MarketsPageContent navigate={navigate} />
);

const MarketsPageContent: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { markets } = useLocalizedContent();

  return (
    <>
      <PageIntro
        label={t('Marchés')}
        title={t('Six terrains où la fermeture devient une décision produit.')}
        copy={t('La même technologie prend une forme différente selon le geste, le support textile, l’environnement et les contraintes de production.')}
        image="/images/markets-hero-collage.png"
      />
      <section className="section market-cards-section">
        <div className="market-card-grid">
          {markets.map((market) => (
            <SmartLink key={market.id} to={marketPath(market)} navigate={navigate} className="market-card reveal">
              <img src={market.image} alt="" />
              <div>
                <h2>{market.title}</h2>
                <p>{market.headline}</p>
                <span>
                  {t('Voir le marché')} <ArrowRight size={16} />
                </span>
              </div>
            </SmartLink>
          ))}
        </div>
      </section>
    </>
  );
};

const MarketPage: React.FC<{ marketId: string; navigate: NavigateFn }> = ({ marketId, navigate }) => {
  const t = useText();
  const { markets, products } = useLocalizedContent();
  const market = resolveMarketFrom(markets, marketId);

  return (
    <>
      <section className="market-detail-hero" style={{ backgroundImage: `url(${market.image})` }}>
        <div className="market-detail-copy reveal">
          <SmartLink to="/marches" navigate={navigate} className="back-link light">
            <ChevronLeft size={16} /> {t('Marchés')}
          </SmartLink>
          <h1>{market.title}</h1>
          <p>{market.headline}</p>
          <SmartLink to="/contact" navigate={navigate} className="primary-action">
            {t('Discuter de ce marché')} <ArrowRight size={17} />
          </SmartLink>
        </div>
      </section>

      <section className="section market-detail-grid">
        <div className="market-needs reveal">
          <h2>{t('Contraintes fréquentes')}</h2>
          {market.needs.map((need) => (
            <div key={need}>
              <Check size={16} /> {need}
            </div>
          ))}
        </div>
        <div className="market-specs reveal">
          <h2>{t('Lecture technique')}</h2>
          {(market.specs ?? []).map((spec) => (
            <article key={spec.label}>
              <span>{spec.label}</span>
              <p>{spec.value}</p>
            </article>
          ))}
        </div>
        <div className="market-applications reveal">
          <h2>{t('Applications')}</h2>
          <ul>
            {market.applications.map((application) => (
              <li key={application}>{application}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section recommended-section">
        <div className="section-head reveal">
          <div>
            <p className="section-label">{t('Produits recommandés')}</p>
            <h2>{t('Configurations à étudier pour')} {market.title.toLowerCase()}.</h2>
          </div>
        </div>
        <div className="recommended-grid">
          {products.filter((product) => market.recommendedProducts.includes(product.title)).map((product) => (
            <ProductMiniCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>
      </section>

      <FaqSection faq={market.faq ?? []} />
      <FinalCta navigate={navigate} />
    </>
  );
};

const ProductMiniCard: React.FC<{ product: ProductFamily; navigate: NavigateFn }> = ({ product, navigate }) => (
  <SmartLink to={productPath(product)} navigate={navigate} className="mini-card reveal">
    <img src={product.image} alt="" />
    <strong>{product.title}</strong>
    <span>{product.summary}</span>
  </SmartLink>
);

const TechnologyPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { technologySteps, technologyCapabilities, technologyComparison } = useLocalizedContent();
  const [activeStepId, setActiveStepId] = useState(technologySteps[0].id);
  const activeStep = technologySteps.find((step) => step.id === activeStepId) ?? technologySteps[0];

  return (
    <>
      <PageIntro
        label={t('Technologie')}
        title={t('Auto-positionnement, maintien réparti, ouverture par pelage.')}
        copy={t('SYSTEMMAG organise les polarités dans le textile pour rendre le geste plus tolérant : les deux parties se rapprochent, se positionnent et s’attirent automatiquement.')}
        image="/images/technology-hero-ai-workbench.png"
        actions={
          <SmartLink to="/contact" navigate={navigate} className="primary-action">
            {t('Étudier une application')} <ArrowRight size={17} />
          </SmartLink>
        }
      />
      <section className="section technology-lab">
        <div className="tech-visual reveal">
          <img src={activeStep.image} alt={activeStep.title} />
        </div>
        <div className="tech-steps reveal">
          {technologySteps.map((step) => (
            <button
              key={step.id}
              className={step.id === activeStep.id ? 'active' : ''}
              onMouseEnter={() => setActiveStepId(step.id)}
              onFocus={() => setActiveStepId(step.id)}
              onClick={() => setActiveStepId(step.id)}
            >
              <span>{String(step.id).padStart(2, '0')}</span>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </button>
          ))}
        </div>
      </section>
      <section className="section capability-section">
        <div className="section-head reveal">
          <div>
            <p className="section-label">{t('Capacités')}</p>
            <h2>{t('Ce que la technologie apporte au produit final.')}</h2>
          </div>
        </div>
        <div className="capability-grid">
          {technologyCapabilities.map((capability) => (
            <article key={capability.title} className="capability-card reveal">
              <h3>{capability.title}</h3>
              <p>{capability.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section comparison-section">
        <div className="comparison-panel reveal">
          <h2>{t('Comparaison d’usage')}</h2>
          {technologyComparison.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </section>
      <FinalCta navigate={navigate} />
    </>
  );
};

const IntegrationPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { processSteps } = useLocalizedContent();

  return (
    <>
      <PageIntro
        label={t('Savoir-faire')}
        title={t('Du cadrage au passage en série.')}
        copy={t('SYSTEMMAG accompagne vos équipes pour convertir une contrainte d’usage en architecture magnétique intégrable, testée et documentée.')}
        image="/images/cadrage-blueprint.png"
        actions={
          <SmartLink to="/contact" navigate={navigate} className="primary-action">
            {t('Démarrer un cadrage')} <ArrowRight size={17} />
          </SmartLink>
        }
      />
      <section className="section process-deep">
        {processSteps.map((step) => (
          <article key={step.id} className="process-deep-row reveal">
            <span>{String(step.id).padStart(2, '0')}</span>
            <img src={step.image} alt="" />
            <div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </section>
      <FinalCta navigate={navigate} />
    </>
  );
};

const AboutPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { aboutTimeline } = useLocalizedContent();

  return (
    <>
      <PageIntro
        label={t('Entreprise')}
        title={t('Une technologie magnétique textile née et développée à Paris.')}
        copy={t('Depuis 2000, SYSTEMMAG développe des systèmes brevetés pour rendre les fermetures plus discrètes, plus rapides et plus adaptées aux contraintes du produit.')}
        image="/images/eric-sitbon-usine.webp"
      />
      <section className="section timeline-section">
        {aboutTimeline.map((item) => (
          <article key={item.label} className="timeline-row reveal">
            <span>{item.label}</span>
            <p>{item.value}</p>
          </article>
        ))}
      </section>
      <FinalCta navigate={navigate} />
    </>
  );
};

const ContactPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { contactItems, markets } = useLocalizedContent();

  return (
    <section className="contact-page">
      <div className="contact-copy reveal">
        <p className="section-label">{t('Contact')}</p>
        <h1>{t('Parlons de votre intégration.')}</h1>
        <p>{t('Décrivez le produit, le geste attendu, le support textile et le niveau de contrainte. Nous vous orienterons vers la bonne architecture.')}</p>
        <div className="contact-list">
          {contactItems.map(({ icon: Icon, label }) => (
            <div key={label}>
              <Icon size={18} /> {label}
            </div>
          ))}
        </div>
      </div>
      <form className="contact-form reveal" onSubmit={(event) => event.preventDefault()}>
        <label>
          {t('Nom et entreprise')}
          <input placeholder={t('Votre nom, société')} />
        </label>
        <label>
          {t('Email')}
          <input type="email" placeholder={t('nom@entreprise.com')} />
        </label>
        <label>
          {t('Marché concerné')}
          <select defaultValue="">
            <option value="" disabled>
              {t('Sélectionner')}
            </option>
            {markets.map((market) => (
              <option key={market.id}>{market.title}</option>
            ))}
          </select>
        </label>
        <label>
          {t('Description du projet')}
          <textarea placeholder={t('Usage, support textile, contrainte, volume, calendrier...')} />
        </label>
        <button className="primary-action large" type="submit">
          {t('Envoyer la demande')} <ArrowRight size={18} />
        </button>
        <SmartLink to="/echantillon" navigate={navigate} className="text-link">
          {t('Demander plutôt un échantillon')} <ArrowRight size={16} />
        </SmartLink>
      </form>
    </section>
  );
};

const SamplePage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { productDecisionPaths } = useLocalizedContent();

  return (
    <>
      <PageIntro
        label={t('Échantillon')}
        title={t('Préparer un premier essai technique.')}
        copy={t('Une demande d’échantillon est utile lorsque le support, le geste et l’effort attendu sont déjà identifiés.')}
        image="/images/prototype-cta.png"
        actions={
          <SmartLink to="/contact" navigate={navigate} className="primary-action">
            {t('Envoyer une demande')} <ArrowRight size={17} />
          </SmartLink>
        }
      />
      <section className="section decision-grid">
        {productDecisionPaths.map((path) => (
          <article className="decision-card reveal" key={path.title}>
            <h3>{path.title}</h3>
            <p>{path.text}</p>
            <strong>{path.target}</strong>
          </article>
        ))}
      </section>
    </>
  );
};

const BlogPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { blogPosts } = useLocalizedContent();

  return (
    <>
      <PageIntro
        label={t('Ressources')}
        title={t('Guides techniques pour cadrer une fermeture magnétique.')}
        copy={t('Articles, méthodes et repères pour discuter avec vos équipes design, R&D, achat ou production.')}
        image="/images/technology-hero-ai-workbench.png"
      />
      <section className="section blog-index">
        {blogPosts.map((post) => (
          <SmartLink key={post.slug} to={`/blog/${post.slug}`} navigate={navigate} className="blog-card reveal">
            <img src={post.coverImage} alt="" />
            <div>
              <span>{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </div>
            <ArrowUpRight size={20} />
          </SmartLink>
        ))}
      </section>
    </>
  );
};

const ArticlePage: React.FC<{ slug: string; navigate: NavigateFn }> = ({ slug, navigate }) => {
  const t = useText();
  const { blogPosts } = useLocalizedContent();
  const post = resolveArticleFrom(blogPosts, slug);

  return (
    <article className="article-page">
      <SmartLink to="/blog" navigate={navigate} className="back-link reveal">
        <ChevronLeft size={16} /> {t('Ressources')}
      </SmartLink>
      <header className="article-header reveal">
        <span>{post.category}</span>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <small>
          {post.author} · {post.publishDate}
        </small>
      </header>
      <img className="article-cover reveal" src={post.coverImage} alt="" />
      <div className="article-body">
        {post.body.map((block) => (
          <section key={block.title} className="reveal">
            <h2>{block.title}</h2>
            <p>{block.text}</p>
          </section>
        ))}
      </div>
    </article>
  );
};

const PressPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { pressItems } = useLocalizedContent();

  return (
    <>
      <PageIntro
        label={t('Presse')}
        title={t('SYSTEMMAG dans les médias.')}
        copy={t('Quelques apparitions et mentions publiques autour de la technologie et de ses usages.')}
        image="/images/cta-systemmag-orange.png"
      />
      <section className="section press-list">
        {pressItems.map((item) => (
          <article key={`${item.media}-${item.date}`} className="press-row reveal">
            <strong>{item.media}</strong>
            <span>{item.format}</span>
            <p>{item.date}</p>
          </article>
        ))}
      </section>
      <FinalCta navigate={navigate} />
    </>
  );
};

const LegalPage: React.FC<{ slug: string; navigate: NavigateFn }> = ({ slug, navigate }) => {
  const t = useText();
  const { legalPages } = useLocalizedContent();
  const page = resolveLegalPageFrom(legalPages, slug);

  return (
    <article className="legal-page">
      <SmartLink to="/" navigate={navigate} className="back-link reveal">
        <ChevronLeft size={16} /> {t('Accueil')}
      </SmartLink>
      <header className="article-header reveal">
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
      </header>
      <div className="article-body">
        {page.sections.map((section) => (
          <section key={section.title} className="reveal">
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </div>
    </article>
  );
};

const FaqSection: React.FC<{ faq: Array<{ question: string; answer: string }> }> = ({ faq }) => {
  const t = useText();
  if (!faq.length) return null;
  return (
    <section className="section faq-section">
      <div className="section-head reveal">
        <div>
          <p className="section-label">FAQ</p>
          <h2>{t('Questions fréquentes.')}</h2>
        </div>
      </div>
      <div className="faq-list">
        {faq.map((item) => (
          <details key={item.question} className="reveal">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

const Footer: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const t = useText();
  const { products, markets, contactItems } = useLocalizedContent();

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src="/images/logo-systemmag.png" alt="SYSTEMMAG" />
        <p>{t('Fermetures magnétiques intégrées aux textiles, accessoires et équipements techniques.')}</p>
      </div>
      <div className="footer-grid">
        <div>
          <h3>{t('Produits')}</h3>
          {products.map((product) => (
            <SmartLink key={product.id} to={productPath(product)} navigate={navigate}>
              {product.title}
            </SmartLink>
          ))}
        </div>
        <div>
          <h3>{t('Marchés')}</h3>
          {markets.slice(0, 6).map((market) => (
            <SmartLink key={market.id} to={marketPath(market)} navigate={navigate}>
              {market.title}
            </SmartLink>
          ))}
        </div>
        <div>
          <h3>{t('Ressources')}</h3>
          <SmartLink to="/technology" navigate={navigate}>{t('Technologie')}</SmartLink>
          <SmartLink to="/integration" navigate={navigate}>{t('Savoir-faire')}</SmartLink>
          <SmartLink to="/blog" navigate={navigate}>Blog</SmartLink>
          <SmartLink to="/about" navigate={navigate}>{t('Entreprise')}</SmartLink>
          <SmartLink to="/press" navigate={navigate}>{t('Presse')}</SmartLink>
          <a href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer">
            {t('Catalogue technique')}
          </a>
        </div>
        <div>
          <h3>{t('Contact')}</h3>
          {contactItems.map(({ label }) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 SYSTEMMAG</span>
        <SmartLink to="/legal" navigate={navigate}>{t('Mentions légales')}</SmartLink>
        <SmartLink to="/privacy" navigate={navigate}>{t('Confidentialité')}</SmartLink>
      </div>
    </footer>
  );
};

export default App;
