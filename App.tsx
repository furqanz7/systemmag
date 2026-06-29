import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  Download,
  FileText,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
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

type NavigateFn = (path: string) => void;

const CONTACT_ITEMS = [
  { icon: MapPin, label: '20 rue Bouvier, 75011 Paris' },
  { icon: Phone, label: '+33 1 45 08 91 41' },
  { icon: Mail, label: 'contact@systemmag.com' },
];

const LANG_PREFIX = '/fr';

const stripLanguagePrefix = (path: string) => path.replace(/^\/(?:fr|en)(?=\/|$)/, '') || '/';

const localPath = (path: string) => `${LANG_PREFIX}${path === '/' ? '' : path}`;

const productPath = (product: ProductFamily) => `/produits/${product.id}`;
const marketPath = (market: Market) => `/marches/${market.id}`;

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

const resolveProduct = (id: string) => (
  PRODUCTS.find((product) => product.id === id || product.aliases?.includes(id)) ?? PRODUCTS[0]
);

const resolveMarket = (id: string) => (
  MARKETS.find((market) => market.id === id || market.aliases?.includes(id)) ?? MARKETS[0]
);

const resolveArticle = (slug: string) => BLOG_POSTS.find((post) => post.slug === slug) ?? BLOG_POSTS[0];
const resolveLegalPage = (slug: string) => LEGAL_PAGES.find((page) => page.slug === slug) ?? LEGAL_PAGES[0];

const pageTitle = (route: AppRoute): string => {
  if (route.kind === 'product') return `${resolveProduct(route.id).title} — ${APP_NAME}`;
  if (route.kind === 'market') return `${resolveMarket(route.id).title} — ${APP_NAME}`;
  if (route.kind === 'technology') return `Technologie — ${APP_NAME}`;
  if (route.kind === 'products') return `Produits — ${APP_NAME}`;
  if (route.kind === 'markets') return `Marchés — ${APP_NAME}`;
  if (route.kind === 'integration') return `Savoir-faire — ${APP_NAME}`;
  if (route.kind === 'blog') return `Ressources — ${APP_NAME}`;
  if (route.kind === 'article') return `${resolveArticle(route.slug).title} — ${APP_NAME}`;
  if (route.kind === 'contact') return `Contact — ${APP_NAME}`;
  return `${APP_NAME} — La fermeture magnétique conçue pour disparaître`;
};

const useScrollSystems = (route: AppRoute) => {
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
    document.title = pageTitle(route);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [route]);

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
  }, [route]);
};

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(() => parseRoute());

  useScrollSystems(route);

  useEffect(() => {
    const onPopState = () => setRoute(parseRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate: NavigateFn = (path) => {
    const target = localPath(path);
    if (window.location.pathname === target) return;
    window.history.pushState(null, '', target);
    setRoute(parseRoute());
  };

  return (
    <SiteShell route={route} navigate={navigate}>
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
  );
};

const RouteRenderer: React.FC<{ route: AppRoute; navigate: NavigateFn }> = ({ route, navigate }) => {
  if (route.kind === 'home') return <HomePage navigate={navigate} />;
  if (route.kind === 'technology') return <TechnologyPage navigate={navigate} />;
  if (route.kind === 'products') return <ProductsPage navigate={navigate} />;
  if (route.kind === 'product') return <ProductPage product={resolveProduct(route.id)} navigate={navigate} />;
  if (route.kind === 'markets') return <MarketsPage navigate={navigate} />;
  if (route.kind === 'market') return <MarketPage market={resolveMarket(route.id)} navigate={navigate} />;
  if (route.kind === 'integration') return <IntegrationPage navigate={navigate} />;
  if (route.kind === 'about') return <AboutPage navigate={navigate} />;
  if (route.kind === 'contact') return <ContactPage navigate={navigate} />;
  if (route.kind === 'sample') return <SamplePage navigate={navigate} />;
  if (route.kind === 'blog') return <BlogPage navigate={navigate} />;
  if (route.kind === 'article') return <ArticlePage post={resolveArticle(route.slug)} navigate={navigate} />;
  if (route.kind === 'press') return <PressPage navigate={navigate} />;
  if (route.kind === 'legal') return <LegalPage page={resolveLegalPage(route.slug)} navigate={navigate} />;
  return <HomePage navigate={navigate} />;
};

const SiteShell: React.FC<{ children: React.ReactNode; route: AppRoute; navigate: NavigateFn }> = ({
  children,
  route,
  navigate,
}) => (
  <>
    <Header route={route} navigate={navigate} />
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
}> = ({ to, navigate, className, children, onClick }) => (
  <a
    href={localPath(to)}
    className={className}
    onClick={(event) => {
      event.preventDefault();
      onClick?.();
      navigate(to);
    }}
  >
    {children}
  </a>
);

const Header: React.FC<{ route: AppRoute; navigate: NavigateFn }> = ({ route, navigate }) => {
  const [mega, setMega] = useState<'products' | 'markets' | 'resources' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <button
            className={route.kind === 'technology' ? 'nav-link active' : 'nav-link'}
            onClick={() => navigate('/technology')}
          >
            Technologie
          </button>
          <button
            className={route.kind === 'products' || route.kind === 'product' ? 'nav-link active' : 'nav-link'}
            onMouseEnter={() => setMega('products')}
            onFocus={() => setMega('products')}
            onClick={() => navigate('/produits')}
          >
            Produits <ChevronDown size={14} />
          </button>
          <button
            className={route.kind === 'markets' || route.kind === 'market' ? 'nav-link active' : 'nav-link'}
            onMouseEnter={() => setMega('markets')}
            onFocus={() => setMega('markets')}
            onClick={() => navigate('/marches')}
          >
            Marchés <ChevronDown size={14} />
          </button>
          <button className={route.kind === 'integration' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('/integration')}>
            Savoir-faire
          </button>
          <a className="nav-link" href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer">
            Catalogue technique
          </a>
          <button
            className={route.kind === 'blog' || route.kind === 'article' ? 'nav-link active' : 'nav-link'}
            onMouseEnter={() => setMega('resources')}
            onFocus={() => setMega('resources')}
            onClick={() => navigate('/blog')}
          >
            Ressources <ChevronDown size={14} />
          </button>
          <button className={route.kind === 'contact' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('/contact')}>
            Contact
          </button>
        </nav>

        <div className="header-actions">
          <button className="search-button" aria-label="Rechercher">
            <Search size={18} />
          </button>
          <div className="language-group" aria-label="Langues">
            <span>FR</span>
            <span>EN</span>
          </div>
          <button className="primary-action" onClick={() => navigate('/contact')}>
            Parler à un expert <ArrowRight size={17} />
          </button>
          <button className="mobile-menu-button" aria-label="Menu" onClick={() => setMobileOpen((value) => !value)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mega && (
          <motion.div
            className="mega-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
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
              ['Technologie', '/technology'],
              ['Produits', '/produits'],
              ['Marchés', '/marches'],
              ['Savoir-faire', '/integration'],
              ['Ressources', '/blog'],
              ['Contact', '/contact'],
            ].map(([label, path]) => (
              <SmartLink key={path} to={path} navigate={navigate} onClick={closeAll}>
                {label}
              </SmartLink>
            ))}
            <a href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer" onClick={closeAll}>
              Catalogue technique
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

const ProductsMega: React.FC<{ navigate: NavigateFn; close: () => void }> = ({ navigate, close }) => (
  <div className="mega-grid">
    <div>
      <p className="mega-title">Familles de produits</p>
      <p className="mega-copy">Choisir une fermeture, un module ou une intégration selon le geste attendu.</p>
    </div>
    <div className="mega-list">
      {PRODUCTS.map((product) => (
        <SmartLink key={product.id} to={productPath(product)} navigate={navigate} onClick={close} className="mega-item">
          <span>{product.number}</span>
          <strong>{product.title}</strong>
          <small>{product.summary}</small>
        </SmartLink>
      ))}
    </div>
  </div>
);

const MarketsMega: React.FC<{ navigate: NavigateFn; close: () => void }> = ({ navigate, close }) => (
  <div className="mega-grid">
    <div>
      <p className="mega-title">Applications</p>
      <p className="mega-copy">Des usages où le geste, la discrétion et la fiabilité comptent.</p>
    </div>
    <div className="mega-list mega-list-two">
      {MARKETS.map((market) => (
        <SmartLink key={market.id} to={marketPath(market)} navigate={navigate} onClick={close} className="mega-item">
          <span>{market.title}</span>
          <small>{market.description}</small>
        </SmartLink>
      ))}
    </div>
  </div>
);

const ResourcesMega: React.FC<{ navigate: NavigateFn; close: () => void }> = ({ navigate, close }) => (
  <div className="mega-grid">
    <div>
      <p className="mega-title">Documentation</p>
      <p className="mega-copy">Comprendre le principe, cadrer un projet et préparer un échange technique.</p>
    </div>
    <div className="mega-list mega-list-two">
      <a href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer" className="mega-item" onClick={close}>
        <span>PDF</span>
        <strong>Catalogue technique</strong>
        <small>Formats, familles et premières indications d’intégration.</small>
      </a>
      <SmartLink to="/blog" navigate={navigate} onClick={close} className="mega-item">
        <span>Articles</span>
        <strong>Ressources</strong>
        <small>Guides de cadrage, technologie textile et usages.</small>
      </SmartLink>
      <SmartLink to="/press" navigate={navigate} onClick={close} className="mega-item">
        <span>Presse</span>
        <strong>Revue media</strong>
        <small>Historique public et mentions de SYSTEMMAG.</small>
      </SmartLink>
      <SmartLink to="/echantillon" navigate={navigate} onClick={close} className="mega-item">
        <span>Projet</span>
        <strong>Demande d’échantillon</strong>
        <small>Qualifier un usage et préparer un premier essai.</small>
      </SmartLink>
    </div>
  </div>
);

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
  const [activeMarket, setActiveMarket] = useState(MARKETS[0]);
  const [activeTech, setActiveTech] = useState(TECHNOLOGY_STEPS[0]);

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy reveal">
          <h1>
            La fermeture magnétique conçue pour <span>disparaître.</span>
          </h1>
          <p>
            Systèmes magnétiques intégrés aux textiles, accessoires et équipements techniques pour créer des fermetures
            discrètes, souples et adaptées à vos contraintes d’usage.
          </p>
          <div className="hero-actions">
            <button className="primary-action large" onClick={() => navigate('/contact')}>
              Parler à un expert <ArrowRight size={18} />
            </button>
            <a className="secondary-action" href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer">
              Voir le catalogue <Download size={17} />
            </a>
          </div>
        </div>

        <div className="hero-media-wrap reveal">
          <figure className="hero-media parallax-media">
            <img src="/images/cinematic-hero-mockup-v3.png" alt="Détail textile d’une fermeture magnétique Systemmag" />
          </figure>
          <div className="hero-annotation top">Ruban textile technique</div>
          <div className="hero-annotation bottom">Architecture magnétique intégrée</div>
        </div>
      </section>

      <TrustStrip />

      <section className="section split-section" id="technology">
        <div className="section-copy reveal">
          <p className="section-label">Technologie</p>
          <h2>Une fermeture qui se positionne, maintient et s’ouvre naturellement.</h2>
          <p>
            Le système répartit la force dans le textile : l’utilisateur rapproche les deux parties, les polarités
            s’alignent, puis l’ouverture se fait par pelage, aimant après aimant.
          </p>
          <button className="text-link" onClick={() => navigate('/technology')}>
            Découvrir le principe <ArrowRight size={16} />
          </button>
        </div>

        <div className="mechanism-board reveal">
          <div className="mechanism-image">
            <img src={activeTech.image} alt={activeTech.title} />
          </div>
          <div className="mechanism-steps">
            {TECHNOLOGY_STEPS.map((step) => (
              <button
                key={step.id}
                className={step.id === activeTech.id ? 'mechanism-step active' : 'mechanism-step'}
                onMouseEnter={() => setActiveTech(step)}
                onFocus={() => setActiveTech(step)}
                onClick={() => setActiveTech(step)}
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
            <p className="section-label">Produits</p>
            <h2>Familles produits pour composer votre fermeture.</h2>
          </div>
          <button className="secondary-action dark" onClick={() => navigate('/produits')}>
            Tous les produits <ArrowRight size={17} />
          </button>
        </div>
        <div className="product-rows">
          {PRODUCTS.map((product) => (
            <button key={product.id} className="product-row reveal" onClick={() => navigate(productPath(product))}>
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
            </button>
          ))}
        </div>
      </section>

      <section className="section markets-section" id="markets">
        <div className="market-stage reveal" style={{ backgroundImage: `url(${activeMarket.image})` }}>
          <div>
            <p className="section-label light">Marchés</p>
            <h2>Conçu pour les produits où le geste ne doit pas échouer.</h2>
            <p>{activeMarket.headline}</p>
            <button className="primary-action" onClick={() => navigate(marketPath(activeMarket))}>
              Voir {activeMarket.title} <ArrowRight size={17} />
            </button>
          </div>
        </div>
        <div className="market-list reveal">
          {MARKETS.map((market) => (
            <button
              key={market.id}
              className={market.id === activeMarket.id ? 'market-row active' : 'market-row'}
              onMouseEnter={() => setActiveMarket(market)}
              onFocus={() => setActiveMarket(market)}
              onClick={() => navigate(marketPath(market))}
            >
              <span>{String(MARKETS.indexOf(market) + 1).padStart(2, '0')}</span>
              <strong>{market.title}</strong>
              <small>{market.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="section architecture-section">
        <div className="section-head reveal">
          <div>
            <p className="section-label">Architecture</p>
            <h2>Un choix de fermeture commence par la contrainte d’usage.</h2>
          </div>
          <button className="text-link" onClick={() => navigate('/integration')}>
            Parler intégration <ArrowRight size={16} />
          </button>
        </div>
        <div className="decision-grid">
          {PRODUCT_DECISION_PATHS.map((path, index) => (
            <article key={path.title} className="decision-card reveal">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{path.title}</h3>
              <p>{path.text}</p>
              <strong>{path.target}</strong>
            </article>
          ))}
        </div>
      </section>

      <ProcessPreview navigate={navigate} />
      <ResourcesPreview navigate={navigate} />
      <FinalCta navigate={navigate} />
    </>
  );
};

const TrustStrip: React.FC = () => (
  <section className="trust-strip reveal">
    {TRUST_BADGES.map((badge) => (
      <div key={badge.label}>
        <strong>{badge.label}</strong>
        <span>{badge.value}</span>
      </div>
    ))}
  </section>
);

const ProcessPreview: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <section className="section process-preview" id="integration">
    <div className="section-copy reveal">
      <p className="section-label">Du prototype à la série</p>
      <h2>Un accompagnement pour transformer une idée de fermeture en solution industrialisable.</h2>
      <p>
        La valeur de Systemmag est autant dans le composant que dans son intégration : force, textile, couture, finition,
        lavage, usage et volume sont cadrés ensemble.
      </p>
    </div>
    <div className="process-track">
      {PROCESS_STEPS.map((step) => (
        <article key={step.id} className="process-card reveal">
          <img src={step.image} alt="" />
          <span>{String(step.id).padStart(2, '0')}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </article>
      ))}
    </div>
    <button className="secondary-action dark reveal" onClick={() => navigate('/integration')}>
      Voir le savoir-faire <ArrowRight size={17} />
    </button>
  </section>
);

const ResourcesPreview: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <section className="section resources-preview">
    <div className="section-head reveal">
      <div>
        <p className="section-label">Ressources</p>
        <h2>De la documentation pour avancer avec vos équipes.</h2>
      </div>
      <button className="text-link" onClick={() => navigate('/blog')}>
        Toutes les ressources <ArrowRight size={16} />
      </button>
    </div>
    <div className="resource-grid">
      {BLOG_POSTS.map((post) => (
        <button key={post.slug} className="resource-card reveal" onClick={() => navigate(`/blog/${post.slug}`)}>
          <img src={post.coverImage} alt="" />
          <span>{post.category}</span>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
        </button>
      ))}
    </div>
  </section>
);

const FinalCta: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <section className="final-cta reveal">
    <div>
      <h2>Une question technique ou un projet à cadrer ?</h2>
      <p>Présentez votre produit, votre contrainte d’usage ou votre besoin d’échantillon.</p>
    </div>
    <div className="cta-actions">
      <button className="primary-action large" onClick={() => navigate('/contact')}>
        Parler à un expert <ArrowRight size={18} />
      </button>
      <button className="secondary-action dark" onClick={() => navigate('/echantillon')}>
        Demander un échantillon
      </button>
    </div>
  </section>
);

const ProductsPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <>
    <PageIntro
      label="Produits"
      title="Un catalogue court, pensé pour l’intégration."
      copy="Systemmag propose des familles de composants et un bureau d’étude pour adapter la fermeture magnétique au produit final."
      image="/images/cinematic-product-theatre-v3.png"
      actions={
        <>
          <a className="primary-action" href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer">
            Télécharger le catalogue <Download size={17} />
          </a>
          <button className="secondary-action dark" onClick={() => navigate('/contact')}>
            Parler à un expert
          </button>
        </>
      }
    />
    <section className="section catalogue-grid-section">
      <div className="catalogue-grid">
        {PRODUCTS.map((product) => (
          <ProductCatalogueCard key={product.id} product={product} navigate={navigate} />
        ))}
      </div>
    </section>
    <section className="section formats-section">
      <div className="section-head reveal">
        <div>
          <p className="section-label">Formats BA</p>
          <h2>Bandes aimantées disponibles pour cadrer la force.</h2>
        </div>
      </div>
      <div className="format-grid">
        {BA_FORMATS.map((format) => (
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

const ProductCatalogueCard: React.FC<{ product: ProductFamily; navigate: NavigateFn }> = ({ product, navigate }) => (
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
      <button className="text-link" onClick={() => navigate(productPath(product))}>
        Voir la famille <ArrowRight size={16} />
      </button>
    </div>
  </article>
);

const ProductPage: React.FC<{ product: ProductFamily; navigate: NavigateFn }> = ({ product, navigate }) => {
  const galleryImages = useMemo(() => Array.from(new Set([product.image, ...product.gallery])), [product]);
  const [activeImage, setActiveImage] = useState(galleryImages[0] ?? product.image);

  useEffect(() => {
    setActiveImage(galleryImages[0] ?? product.image);
  }, [galleryImages, product.image]);

  return (
    <>
      <section className="product-detail-hero">
        <aside className="product-sidebar reveal">
          <p>Produits</p>
          {PRODUCTS.map((item) => (
            <button
              key={item.id}
              className={item.id === product.id ? 'active' : ''}
              onClick={() => navigate(productPath(item))}
            >
              {item.title}
            </button>
          ))}
          <a href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer">
            <FileText size={17} /> Catalogue technique
          </a>
        </aside>

        <div className="product-hero-copy reveal">
          <button className="back-link" onClick={() => navigate('/produits')}>
            <ChevronLeft size={16} /> Produits
          </button>
          <span className="section-label">{product.label}</span>
          <h1>{product.title}</h1>
          <p>{product.detailIntro}</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => navigate('/contact')}>
              Parler à un expert <ArrowRight size={17} />
            </button>
            <button className="secondary-action dark" onClick={() => navigate('/echantillon')}>
              Demander un échantillon
            </button>
          </div>
        </div>

        <div className="product-gallery reveal">
          <figure>
            <img src={activeImage} alt={product.title} />
          </figure>
          <div className="gallery-thumbs">
            {galleryImages.slice(0, 5).map((image) => (
              <button key={image} className={image === activeImage ? 'active' : ''} onClick={() => setActiveImage(image)}>
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
          <InfoBlock title="Applications" items={product.useCases} />
          <InfoBlock title="Méthodes d’intégration" items={product.integration} />
          <InfoBlock title="Contraintes cadrées" items={product.constraints} />
        </div>
        <div className="variant-panel reveal">
          <h2>Variantes disponibles</h2>
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
            <p className="section-label">Spécifications</p>
            <h2>Premiers repères techniques.</h2>
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
  <>
    <PageIntro
      label="Marchés"
      title="Six terrains où la fermeture devient une décision produit."
      copy="La même technologie prend une forme différente selon le geste, le support textile, l’environnement et les contraintes de production."
      image="/images/markets-hero-collage.png"
    />
    <section className="section market-cards-section">
      <div className="market-card-grid">
        {MARKETS.map((market) => (
          <button key={market.id} className="market-card reveal" onClick={() => navigate(marketPath(market))}>
            <img src={market.image} alt="" />
            <div>
              <h2>{market.title}</h2>
              <p>{market.headline}</p>
              <span>
                Voir le marché <ArrowRight size={16} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  </>
);

const MarketPage: React.FC<{ market: Market; navigate: NavigateFn }> = ({ market, navigate }) => (
  <>
    <section className="market-detail-hero" style={{ backgroundImage: `url(${market.image})` }}>
      <div className="market-detail-copy reveal">
        <button className="back-link light" onClick={() => navigate('/marches')}>
          <ChevronLeft size={16} /> Marchés
        </button>
        <h1>{market.title}</h1>
        <p>{market.headline}</p>
        <button className="primary-action" onClick={() => navigate('/contact')}>
          Discuter de ce marché <ArrowRight size={17} />
        </button>
      </div>
    </section>

    <section className="section market-detail-grid">
      <div className="market-needs reveal">
        <h2>Contraintes fréquentes</h2>
        {market.needs.map((need) => (
          <div key={need}>
            <Check size={16} /> {need}
          </div>
        ))}
      </div>
      <div className="market-specs reveal">
        <h2>Lecture technique</h2>
        {(market.specs ?? []).map((spec) => (
          <article key={spec.label}>
            <span>{spec.label}</span>
            <p>{spec.value}</p>
          </article>
        ))}
      </div>
      <div className="market-applications reveal">
        <h2>Applications</h2>
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
          <p className="section-label">Produits recommandés</p>
          <h2>Configurations à étudier pour {market.title.toLowerCase()}.</h2>
        </div>
      </div>
      <div className="recommended-grid">
        {PRODUCTS.filter((product) => market.recommendedProducts.includes(product.title)).map((product) => (
          <ProductMiniCard key={product.id} product={product} navigate={navigate} />
        ))}
      </div>
    </section>

    <FaqSection faq={market.faq ?? []} />
    <FinalCta navigate={navigate} />
  </>
);

const ProductMiniCard: React.FC<{ product: ProductFamily; navigate: NavigateFn }> = ({ product, navigate }) => (
  <button className="mini-card reveal" onClick={() => navigate(productPath(product))}>
    <img src={product.image} alt="" />
    <strong>{product.title}</strong>
    <span>{product.summary}</span>
  </button>
);

const TechnologyPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const [activeStep, setActiveStep] = useState(TECHNOLOGY_STEPS[0]);

  return (
    <>
      <PageIntro
        label="Technologie"
        title="Auto-positionnement, maintien réparti, ouverture par pelage."
        copy="SYSTEMMAG organise les polarités dans le textile pour rendre le geste plus tolérant : les deux parties se rapprochent, se positionnent et s’attirent automatiquement."
        image="/images/technology-hero-ai-workbench.png"
        actions={
          <button className="primary-action" onClick={() => navigate('/contact')}>
            Étudier une application <ArrowRight size={17} />
          </button>
        }
      />
      <section className="section technology-lab">
        <div className="tech-visual reveal">
          <img src={activeStep.image} alt={activeStep.title} />
        </div>
        <div className="tech-steps reveal">
          {TECHNOLOGY_STEPS.map((step) => (
            <button
              key={step.id}
              className={step.id === activeStep.id ? 'active' : ''}
              onMouseEnter={() => setActiveStep(step)}
              onFocus={() => setActiveStep(step)}
              onClick={() => setActiveStep(step)}
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
            <p className="section-label">Capacités</p>
            <h2>Ce que la technologie apporte au produit final.</h2>
          </div>
        </div>
        <div className="capability-grid">
          {TECHNOLOGY_CAPABILITIES.map((capability) => (
            <article key={capability.title} className="capability-card reveal">
              <h3>{capability.title}</h3>
              <p>{capability.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section comparison-section">
        <div className="comparison-panel reveal">
          <h2>Comparaison d’usage</h2>
          {TECHNOLOGY_COMPARISON.map((item) => (
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

const IntegrationPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <>
    <PageIntro
      label="Savoir-faire"
      title="Du cadrage au passage en série."
      copy="SYSTEMMAG accompagne vos équipes pour convertir une contrainte d’usage en architecture magnétique intégrable, testée et documentée."
      image="/images/cadrage-blueprint.png"
      actions={
        <button className="primary-action" onClick={() => navigate('/contact')}>
          Démarrer un cadrage <ArrowRight size={17} />
        </button>
      }
    />
    <section className="section process-deep">
      {PROCESS_STEPS.map((step) => (
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

const AboutPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <>
    <PageIntro
      label="Entreprise"
      title="Une technologie magnétique textile née et développée à Paris."
      copy="Depuis 2000, SYSTEMMAG développe des systèmes brevetés pour rendre les fermetures plus discrètes, plus rapides et plus adaptées aux contraintes du produit."
      image="/images/eric-sitbon-usine.webp"
    />
    <section className="section timeline-section">
      {ABOUT_TIMELINE.map((item) => (
        <article key={item.label} className="timeline-row reveal">
          <span>{item.label}</span>
          <p>{item.value}</p>
        </article>
      ))}
    </section>
    <FinalCta navigate={navigate} />
  </>
);

const ContactPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <section className="contact-page">
    <div className="contact-copy reveal">
      <p className="section-label">Contact</p>
      <h1>Parlons de votre intégration.</h1>
      <p>Décrivez le produit, le geste attendu, le support textile et le niveau de contrainte. Nous vous orienterons vers la bonne architecture.</p>
      <div className="contact-list">
        {CONTACT_ITEMS.map(({ icon: Icon, label }) => (
          <div key={label}>
            <Icon size={18} /> {label}
          </div>
        ))}
      </div>
    </div>
    <form className="contact-form reveal" onSubmit={(event) => event.preventDefault()}>
      <label>
        Nom et entreprise
        <input placeholder="Votre nom, société" />
      </label>
      <label>
        Email
        <input type="email" placeholder="nom@entreprise.com" />
      </label>
      <label>
        Marché concerné
        <select defaultValue="">
          <option value="" disabled>
            Sélectionner
          </option>
          {MARKETS.map((market) => (
            <option key={market.id}>{market.title}</option>
          ))}
        </select>
      </label>
      <label>
        Description du projet
        <textarea placeholder="Usage, support textile, contrainte, volume, calendrier..." />
      </label>
      <button className="primary-action large" type="submit">
        Envoyer la demande <ArrowRight size={18} />
      </button>
      <button className="text-link" type="button" onClick={() => navigate('/echantillon')}>
        Demander plutôt un échantillon <ArrowRight size={16} />
      </button>
    </form>
  </section>
);

const SamplePage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <>
    <PageIntro
      label="Échantillon"
      title="Préparer un premier essai technique."
      copy="Une demande d’échantillon est utile lorsque le support, le geste et l’effort attendu sont déjà identifiés."
      image="/images/prototype-cta.png"
      actions={
        <button className="primary-action" onClick={() => navigate('/contact')}>
          Envoyer une demande <ArrowRight size={17} />
        </button>
      }
    />
    <section className="section decision-grid">
      {PRODUCT_DECISION_PATHS.map((path) => (
        <article className="decision-card reveal" key={path.title}>
          <h3>{path.title}</h3>
          <p>{path.text}</p>
          <strong>{path.target}</strong>
        </article>
      ))}
    </section>
  </>
);

const BlogPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <>
    <PageIntro
      label="Ressources"
      title="Guides techniques pour cadrer une fermeture magnétique."
      copy="Articles, méthodes et repères pour discuter avec vos équipes design, R&D, achat ou production."
      image="/images/technology-hero-ai-workbench.png"
    />
    <section className="section blog-index">
      {BLOG_POSTS.map((post) => (
        <button key={post.slug} className="blog-card reveal" onClick={() => navigate(`/blog/${post.slug}`)}>
          <img src={post.coverImage} alt="" />
          <div>
            <span>{post.category}</span>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </div>
          <ArrowUpRight size={20} />
        </button>
      ))}
    </section>
  </>
);

const ArticlePage: React.FC<{ post: BlogPost; navigate: NavigateFn }> = ({ post, navigate }) => (
  <article className="article-page">
    <button className="back-link reveal" onClick={() => navigate('/blog')}>
      <ChevronLeft size={16} /> Ressources
    </button>
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

const PressPage: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <>
    <PageIntro
      label="Presse"
      title="SYSTEMMAG dans les médias."
      copy="Quelques apparitions et mentions publiques autour de la technologie et de ses usages."
      image="/images/cta-systemmag-orange.png"
    />
    <section className="section press-list">
      {PRESS_ITEMS.map((item) => (
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

const LegalPage: React.FC<{ page: LegalPage; navigate: NavigateFn }> = ({ page, navigate }) => (
  <article className="legal-page">
    <button className="back-link reveal" onClick={() => navigate('/')}>
      <ChevronLeft size={16} /> Accueil
    </button>
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

const FaqSection: React.FC<{ faq: Array<{ question: string; answer: string }> }> = ({ faq }) => {
  if (!faq.length) return null;
  return (
    <section className="section faq-section">
      <div className="section-head reveal">
        <div>
          <p className="section-label">FAQ</p>
          <h2>Questions fréquentes.</h2>
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

const Footer: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => (
  <footer className="site-footer">
    <div className="footer-brand">
      <img src="/images/logo-systemmag.png" alt="SYSTEMMAG" />
      <p>Fermetures magnétiques intégrées aux textiles, accessoires et équipements techniques.</p>
    </div>
    <div className="footer-grid">
      <div>
        <h3>Produits</h3>
        {PRODUCTS.map((product) => (
          <button key={product.id} onClick={() => navigate(productPath(product))}>
            {product.title}
          </button>
        ))}
      </div>
      <div>
        <h3>Marchés</h3>
        {MARKETS.slice(0, 6).map((market) => (
          <button key={market.id} onClick={() => navigate(marketPath(market))}>
            {market.title}
          </button>
        ))}
      </div>
      <div>
        <h3>Ressources</h3>
        <button onClick={() => navigate('/technology')}>Technologie</button>
        <button onClick={() => navigate('/integration')}>Savoir-faire</button>
        <button onClick={() => navigate('/blog')}>Blog</button>
        <a href="/downloads/catalogue-systemmag-fr.pdf" target="_blank" rel="noreferrer">
          Catalogue technique
        </a>
      </div>
      <div>
        <h3>Contact</h3>
        {CONTACT_ITEMS.map(({ label }) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2026 SYSTEMMAG</span>
      <button onClick={() => navigate('/legal')}>Mentions légales</button>
      <button onClick={() => navigate('/privacy')}>Confidentialité</button>
    </div>
  </footer>
);

export default App;
