import type {
  BaFormat,
  BlogPost,
  Capability,
  LegalPage,
  Market,
  NavItem,
  PressItem,
  ProcessStep,
  ProductFamily,
  TechnologyStep,
} from './types';

export const APP_NAME = 'SYSTEMMAG';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Technologie', href: '#technology' },
  { label: 'Produits', href: '#products' },
  { label: 'Marchés', href: '#markets' },
  { label: 'Savoir-faire', href: '#integration' },
  { label: 'Contact', href: '#integration' },
];

export const TECHNOLOGY_STEPS: TechnologyStep[] = [
  {
    id: 1,
    title: 'Auto-positionnement',
    description: 'Deux bandes textiles s’approchent : les zones aimantées s’alignent poche à poche.',
    image: '/images/technology/how-it-works/auto-positionnement-rounded.png',
  },
  {
    id: 2,
    title: 'Maintien réparti',
    description: 'Un rabat se superpose partiellement sur l’autre le long de l’arête magnétique.',
    image: '/images/technology/how-it-works/maintien-reparti-rounded.png',
  },
  {
    id: 3,
    title: 'Ouverture par pelage',
    description: 'On soulève une extrémité et l’ouverture progresse avec un geste naturel.',
    image: '/images/technology/how-it-works/ouverture-pelage-rounded.png',
  },
];

export const PRODUCTS: ProductFamily[] = [
  {
    id: 'zips-magnetiques',
    aliases: ['zips-magnetiques', 'zip-c', 'zip-g'],
    number: '01',
    title: 'Zips magnétiques',
    label: 'Fermeture linéaire',
    summary: 'Une fermeture guidée pour textiles, accessoires et équipements qui demandent un geste rapide, propre et discret.',
    detailTitle: 'Un zip magnétique conçu pour guider le geste sans exposer le mécanisme.',
    detailIntro: 'Le zip magnétique Systemmag remplace une fermeture classique par une ligne souple de points aimantés. La fermeture s’aligne naturellement, tient par répartition de force et s’ouvre progressivement par pelage.',
    image: '/images/zip-c-isolated.png',
    gallery: ['/images/hero-integrated-markets.png', '/images/zip-c-top.webp', '/images/zip-g-top.webp'],
    variants: [
      { label: 'Zip C', value: 'Fermeture centrée pour vêtements, accessoires et ouvertures textiles standards.' },
      { label: 'Zip G', value: 'Montage plat et uniforme pour supports qui demandent une lecture plus technique.' },
      { label: 'Zip CE / GE', value: 'Architecture haute puissance pour contraintes lourdes ou maintien renforcé.' },
      { label: 'Zip CD / GD', value: 'Double point magnétique lorsque la sécurité d’accroche prime sur la finesse.' },
    ],
    specs: ['Ouverture par pelage', 'Auto-positionnement', 'Fermeture souple'],
    useCases: ['Textiles techniques', 'Accessoires', 'Équipements à ouverture rapide'],
    integration: ['Couture', 'Thermocollage', 'Développement sur contrainte produit'],
    constraints: ['Geste avec une main', 'Manipulation avec gants', 'Ligne extérieure à préserver', 'Ouverture répétée'],
    proofPoints: [
      { label: 'Geste', value: 'fermeture guidée sans chercher l’alignement parfait' },
      { label: 'Lecture', value: 'mécanisme intégré pour préserver l’extérieur du produit' },
      { label: 'Usage', value: 'adaptable à la tension, au textile et au rayon d’ouverture' },
    ],
    faq: [
      {
        question: 'Quand choisir un zip magnétique plutôt qu’une bande ?',
        answer: 'Quand l’usage principal est une ouverture linéaire répétée : vêtement, rabat long, accessoire ou équipement qui doit se refermer avec un geste guidé.',
      },
      {
        question: 'Le système peut-il rester invisible ?',
        answer: 'Oui, l’intégration est cadrée autour du patronage, de la couture et de l’épaisseur disponible pour garder une finition sobre.',
      },
    ],
    specificationRows: [
      { label: 'Principe', value: 'Alignement magnétique progressif' },
      { label: 'Support', value: 'Textile, accessoire, équipement souple' },
      { label: 'Ouverture', value: 'Pelage linéaire aimant après aimant' },
      { label: 'Développement', value: 'Adaptation au patronage et à la contrainte d’usage' },
    ],
  },
  {
    id: 'bandes-blocs',
    aliases: ['bandes-aimantees', 'bandes-blocs', 'ba-v04', 'ba-v06', 'ba-v08', 'ba-v12'],
    number: '02',
    title: 'Bandes / Blocs d’aimants',
    label: 'Module magnétique',
    summary: 'Des bandes et blocs aimantés pour répartir la force dans une structure textile, un rabat ou un assemblage technique.',
    detailTitle: 'Des modules aimantés configurables pour construire une force précise.',
    detailIntro: 'Les bandes et blocs d’aimants permettent d’intégrer des polarités alternées dans un support. Le format, le nombre de rangs et la distance entre points sont définis selon le geste, la tenue et l’environnement.',
    image: '/images/bandes-iso.webp',
    gallery: ['/images/bandes-iso.webp', '/images/products/approach/approach-blocks.webp', '/images/ba-v08.webp', '/images/ba-v12.webp'],
    variants: [
      { label: 'BA-V04', value: 'Format compact pour faible épaisseur et effort léger.' },
      { label: 'BA-V06', value: 'Format standard pour la majorité des intégrations textiles.' },
      { label: 'BA-V08', value: 'Format renforcé quand le maintien doit rester plus ferme.' },
      { label: 'BA-V12', value: 'Bande large pour surface de contact ou contrainte importante.' },
    ],
    specs: ['Formats BA-V04 à BA-V12', 'Polarités alternées', 'Force modulable'],
    useCases: ['Maintien discret', 'Rabat textile', 'Assemblage technique'],
    integration: ['Poches textiles', 'Bords renforcés', 'Assemblage multi-rangs'],
    constraints: ['Force attendue', 'Épaisseur disponible', 'Rayon de courbure', 'Répétition du geste'],
    proofPoints: [
      { label: 'Architecture', value: 'polarités alternées pour concentrer la force utile' },
      { label: 'Module', value: 'longueur, largeur et rangs ajustés au support' },
      { label: 'Série', value: 'format clarifié avant industrialisation' },
    ],
    faq: [
      {
        question: 'Les formats BA sont-ils des produits finis ?',
        answer: 'Ce sont surtout des modules d’intégration. Leur rôle est de devenir une partie du produit final : rabat, bord, poche ou assemblage textile.',
      },
      {
        question: 'Comment choisir la largeur ?',
        answer: 'Le choix dépend de la force attendue, de l’épaisseur disponible, du rayon de courbure et de la sensation souhaitée à l’ouverture.',
      },
    ],
    specificationRows: [
      { label: 'Formats', value: 'BA-V04, BA-V06, BA-V08, BA-V12' },
      { label: 'Architecture', value: 'Polarités alternées et rangs modulables' },
      { label: 'Usage', value: 'Maintien, guidage, fermeture, positionnement' },
      { label: 'Intégration', value: 'Poche textile, gaine, support technique' },
    ],
  },
  {
    id: 'fourreaux',
    aliases: ['fourreaux', 'fd', 'ff'],
    number: '03',
    title: 'Fourreaux',
    label: 'Gaine textile',
    summary: 'Des fourreaux textiles pour encapsuler, protéger et stabiliser les éléments magnétiques dans le produit final.',
    detailTitle: 'Une gaine propre pour rendre le magnétisme invisible dans le produit.',
    detailIntro: 'Le fourreau sert d’interface entre le module magnétique et l’objet final. Il protège l’aimantation, facilite le montage et permet de conserver une lecture extérieure sobre.',
    image: '/images/fourreau-iso.webp',
    gallery: ['/images/fourreau-iso.webp', '/images/products/approach/approach-fourreau-top.webp', '/images/products/approach/approach-fourreau-bottom.webp'],
    variants: [
      { label: 'FD', value: 'Fourreau droit pour intégration simple et linéaire.' },
      { label: 'FF', value: 'Fourreau de forme pour contour, courbe ou usage sur mesure.' },
      { label: 'Sur mesure', value: 'Gaine adaptée au textile, à la couture et au niveau de protection.' },
    ],
    specs: ['Protection intégrée', 'Souplesse textile', 'Montage propre'],
    useCases: ['Vêtements', 'Équipements souples', 'Supports techniques'],
    integration: ['Insertion', 'Couture périphérique', 'Adaptation au patronage'],
    constraints: ['Propreté de finition', 'Protection mécanique', 'Souplesse au porté', 'Compatibilité couture'],
    proofPoints: [
      { label: 'Protection', value: 'module encapsulé dans une interface textile propre' },
      { label: 'Finition', value: 'lecture visible ou invisible selon le patronage' },
      { label: 'Montage', value: 'simplifie l’assemblage du système dans le produit final' },
    ],
    faq: [
      {
        question: 'À quoi sert le fourreau ?',
        answer: 'Il fait l’interface entre le module magnétique et l’objet final : protection, couture, stabilité et finition.',
      },
      {
        question: 'Peut-il suivre une forme spécifique ?',
        answer: 'Oui, le fourreau peut être défini autour du tracé, du rayon de courbure et de la zone à préserver.',
      },
    ],
    specificationRows: [
      { label: 'Rôle', value: 'Encapsulation et protection du module' },
      { label: 'Finition', value: 'Visible ou invisible selon le patronage' },
      { label: 'Montage', value: 'Insertion, couture, intégration périphérique' },
      { label: 'Adaptation', value: 'Forme et longueur ajustées au projet' },
    ],
  },
  {
    id: 'bureau-etude',
    aliases: ['integration', 'bureau-etude', 'savoir-faire'],
    number: '04',
    title: 'Bureau d’étude / intégration',
    label: 'Développement projet',
    summary: 'Un accompagnement pour cadrer l’usage, définir l’architecture magnétique, prototyper et préparer le passage en série.',
    detailTitle: 'Un bureau d’étude pour transformer une contrainte d’usage en système intégrable.',
    detailIntro: 'Systemmag accompagne les projets de la première contrainte au prototype. L’objectif est de trouver l’équilibre entre force, souplesse, discrétion, production et perception du geste.',
    image: '/images/cadrage-blueprint.png',
    gallery: ['/images/cadrage-blueprint.png', '/images/schema-modules.png', '/images/prototype-validation.jpg'],
    variants: [
      { label: 'Cadrage', value: 'Comprendre le geste, le support, la tension, le lavage et le volume.' },
      { label: 'Prototype', value: 'Assembler une première solution testable avant engagement série.' },
      { label: 'Validation', value: 'Stabiliser la solution, la perception du geste et les contraintes production.' },
    ],
    specs: ['Cadrage usage', 'Prototype', 'Validation série'],
    useCases: ['Projet B2B', 'Produit technique', 'Développement spécifique'],
    integration: ['Analyse contrainte', 'Choix format', 'Dossier technique'],
    constraints: ['Cahier des charges incomplet', 'Produit déjà dessiné', 'Contraintes de production', 'Validation terrain'],
    proofPoints: [
      { label: 'Méthode', value: 'une architecture magnétique définie avant le composant' },
      { label: 'Preuve', value: 'prototype et tests d’usage avant passage série' },
      { label: 'Dialogue', value: 'support technique avec vos équipes R&D, achat ou production' },
    ],
    faq: [
      {
        question: 'Faut-il déjà avoir un cahier des charges complet ?',
        answer: 'Non. Le cadrage sert justement à transformer une intention, un geste ou une contrainte en paramètres techniques.',
      },
      {
        question: 'Systemmag fournit-il un composant ou une intégration ?',
        answer: 'Les deux sont possibles, mais la valeur principale vient de la définition du système autour du produit final.',
      },
    ],
    specificationRows: [
      { label: 'Entrée projet', value: 'Produit, geste, textile, contrainte, volume' },
      { label: 'Livrable', value: 'Architecture, prototype, préconisations d’intégration' },
      { label: 'Méthode', value: 'Cadrage, test, ajustement, validation' },
      { label: 'Sortie', value: 'Solution prête à discuter avec production' },
    ],
  },
];

export const BA_FORMATS: BaFormat[] = [
  { id: 'ba-v04', title: 'BA-V04', meta: 'Bande aimantée compacte', image: '/images/ba-v04.webp' },
  { id: 'ba-v06', title: 'BA-V06', meta: 'Bande aimantée standard', image: '/images/ba-v06.webp' },
  { id: 'ba-v08', title: 'BA-V08', meta: 'Bande aimantée renforcée', image: '/images/ba-v08.webp' },
  { id: 'ba-v12', title: 'BA-V12', meta: 'Bande aimantée large', image: '/images/ba-v12.webp' },
];

export const MARKETS: Market[] = [
  {
    id: 'defense',
    aliases: ['defense', 'defence', 'securite'],
    title: 'Défense',
    headline: 'Des fermetures discrètes pour équipements soumis à la contrainte.',
    description: 'Systèmes discrets et manipulables sous contrainte pour équipements techniques et opérationnels.',
    image: '/images/markets/heroes/defense.webp',
    specs: [
      { label: 'Priorité', value: 'silence, vitesse et fiabilité du geste' },
      { label: 'Contexte', value: 'gants, stress, terrain, équipements portés' },
      { label: 'Architecture', value: 'zip magnétique, bandes renforcées, fourreaux protégés' },
    ],
    needs: ['Geste rapide', 'Discrétion sonore', 'Manipulation avec gants', 'Robustesse du montage'],
    applications: ['Poches tactiques', 'Équipements portés', 'Sacs techniques', 'Rabat de protection'],
    benefits: ['Réduire les gestes secondaires', 'Limiter le bruit d’ouverture', 'Conserver une lecture extérieure sobre', 'Adapter la force au contexte terrain'],
    faq: [
      {
        question: 'Le système convient-il aux équipements manipulés avec des gants ?',
        answer: 'Oui, l’auto-positionnement et l’ouverture par pelage permettent de concevoir un geste large, lisible et manipulable sous contrainte.',
      },
      {
        question: 'Peut-on étudier un projet confidentiel ?',
        answer: 'Oui, le cadrage peut se faire sur description fonctionnelle, contrainte produit et échanges techniques adaptés au niveau de confidentialité.',
      },
    ],
    recommendedProducts: ['Zips magnétiques', 'Bandes / Blocs d’aimants', 'Fourreaux'],
  },
  {
    id: 'sport-extreme',
    aliases: ['sport', 'sport-extreme', 'bagagerie'],
    title: 'Sport extrême',
    headline: 'Une fermeture plus tolérante quand le froid, le mouvement ou les gants compliquent le geste.',
    description: 'Fermetures souples et rapides pour vêtements, sacs et équipements exposés aux usages intensifs.',
    image: '/images/markets/heroes/sport-extreme.png',
    specs: [
      { label: 'Priorité', value: 'geste rapide et tolérance au mouvement' },
      { label: 'Contexte', value: 'froid, humidité, gants, répétition' },
      { label: 'Architecture', value: 'zip souple ou bande répartie selon la tension' },
    ],
    needs: ['Ouverture rapide', 'Tolérance au mouvement', 'Tenue répétée', 'Préhension facilitée'],
    applications: ['Vêtements outdoor', 'Sacs', 'Équipements neige', 'Accessoires sportifs'],
    benefits: ['Manipuler sans chercher la tirette', 'Maintenir la fermeture malgré le mouvement', 'Préserver une sensation textile', 'Réduire les points durs'],
    faq: [
      {
        question: 'Le système reste-t-il souple sur un vêtement technique ?',
        answer: 'La solution est dimensionnée autour du textile et du rayon de courbure pour éviter un effet rigide quand le produit bouge.',
      },
      {
        question: 'Peut-on l’utiliser sur des sacs ou équipements outdoor ?',
        answer: 'Oui, c’est un bon cas d’usage lorsque le geste doit rester rapide, lisible et compatible avec des conditions exigeantes.',
      },
    ],
    recommendedProducts: ['Zips magnétiques', 'Bandes / Blocs d’aimants'],
  },
  {
    id: 'medical',
    aliases: ['medical', 'sante'],
    title: 'Médical',
    headline: 'Des systèmes pensés pour faciliter l’accès, l’habillage et la manipulation.',
    description: 'Solutions pensées pour faciliter l’usage, l’accès et la manipulation sur textiles ou dispositifs adaptés.',
    image: '/images/markets/heroes/medical.webp',
    specs: [
      { label: 'Priorité', value: 'accès, autonomie et geste non contraignant' },
      { label: 'Contexte', value: 'textiles adaptés, orthèses, habillage assisté' },
      { label: 'Architecture', value: 'fermeture guidée, fourreau propre, validation usage' },
    ],
    needs: ['Geste simple', 'Accès rapide', 'Textile adapté', 'Manipulation répétée'],
    applications: ['Vêtements adaptés', 'Orthèses', 'Dispositifs textiles', 'Accès de soin'],
    benefits: ['Faciliter l’habillage', 'Réduire l’effort de précision', 'Conserver une finition digne', 'Adapter le geste aux contraintes de soin'],
    faq: [
      {
        question: 'Le système peut-il aider à l’habillage autonome ?',
        answer: 'Oui, l’objectif peut être de supprimer l’alignement fin et de transformer la fermeture en geste large et guidé.',
      },
      {
        question: 'Comment traiter les contraintes médicales ?',
        answer: 'Elles doivent être cadrées projet par projet : textile, lavage, contact, protocole d’usage et exigences du dispositif.',
      },
    ],
    recommendedProducts: ['Zips magnétiques', 'Fourreaux', 'Bureau d’étude / intégration'],
  },
  {
    id: 'accessoires-mode',
    aliases: ['mode', 'accessoires-mode', 'fashion'],
    title: 'Accessoires et mode',
    headline: 'Une intégration invisible pour préserver la ligne et améliorer le geste.',
    description: 'Intégrations invisibles pour préserver la ligne d’un produit tout en améliorant le geste.',
    image: '/images/markets/heroes/accessoires-mode.png',
    specs: [
      { label: 'Priorité', value: 'finition, ligne extérieure et geste premium' },
      { label: 'Contexte', value: 'sacs, accessoires, vêtements, petite maroquinerie' },
      { label: 'Architecture', value: 'fourreau invisible, module fin, couture propre' },
    ],
    needs: ['Finition propre', 'Ligne extérieure préservée', 'Geste premium', 'Faible encombrement'],
    applications: ['Sacs', 'Petite maroquinerie', 'Vêtements', 'Accessoires textiles'],
    benefits: ['Préserver la silhouette du produit', 'Éviter une quincaillerie visible', 'Créer un geste plus fluide', 'Adapter couleur, couture et finition'],
    faq: [
      {
        question: 'Peut-on cacher complètement la fermeture ?',
        answer: 'Oui, quand le patronage et l’épaisseur disponible le permettent, le système peut disparaître sous la matière.',
      },
      {
        question: 'La sensation peut-elle rester haut de gamme ?',
        answer: 'C’est précisément le rôle du cadrage : ajuster force, souplesse et finition pour que le geste soit cohérent avec l’objet.',
      },
    ],
    recommendedProducts: ['Fourreaux', 'Bandes / Blocs d’aimants', 'Bureau d’étude / intégration'],
  },
  {
    id: 'industrie-technique',
    aliases: ['industrie', 'industrie-technique', 'workwear'],
    title: 'Industrie technique',
    headline: 'Une fermeture fiable pour supports épais, cycles répétés et contraintes de maintenance.',
    description: 'Fermetures adaptées aux contraintes de production, d’entretien, de répétition et de fiabilité.',
    image: '/images/markets/heroes/industrie-technique.webp',
    specs: [
      { label: 'Priorité', value: 'répétition, robustesse et production' },
      { label: 'Contexte', value: 'housses, protections, workwear, supports épais' },
      { label: 'Architecture', value: 'bandes, fourreaux et protocole de montage' },
    ],
    needs: ['Répétition', 'Entretien', 'Support épais', 'Montage stable'],
    applications: ['Housses techniques', 'Protections', 'Équipements professionnels', 'Assemblages textiles'],
    benefits: ['Stabiliser une fermeture répétée', 'Faciliter maintenance et accès', 'Adapter le système à un support épais', 'Préparer la production dès le prototype'],
    faq: [
      {
        question: 'Le système est-il adapté à une production récurrente ?',
        answer: 'Oui, si la phase de validation fixe clairement le format, la couture, l’intégration et les critères d’usage.',
      },
      {
        question: 'Peut-on travailler sur un support épais ?',
        answer: 'Oui, mais la force, le nombre de rangs et le mode d’intégration doivent être dimensionnés pour ce support.',
      },
    ],
    recommendedProducts: ['Bandes / Blocs d’aimants', 'Fourreaux', 'Bureau d’étude / intégration'],
  },
  {
    id: 'mobilite-reduite',
    aliases: ['aide', 'mobilite-reduite', 'accessibilite'],
    title: 'Mobilité réduite',
    headline: 'Rendre l’ouverture et la fermeture plus intuitives quand la précision ou la force sont limitées.',
    description: 'Systèmes intuitifs pour rendre l’ouverture et la fermeture plus accessibles au quotidien.',
    image: '/images/markets/heroes/mobilite-reduite.webp',
    specs: [
      { label: 'Priorité', value: 'autonomie, confort et simplicité' },
      { label: 'Contexte', value: 'précision limitée, force réduite, gestes quotidiens' },
      { label: 'Architecture', value: 'auto-positionnement et ouverture progressive' },
    ],
    needs: ['Geste avec une main', 'Auto-positionnement', 'Préhension simplifiée', 'Confort au quotidien'],
    applications: ['Vêtements adaptés', 'Accessoires d’aide', 'Textiles du quotidien', 'Fermetures accessibles'],
    benefits: ['Réduire la dépendance à un alignement précis', 'Permettre un geste d’une main', 'Rendre l’usage moins frustrant', 'Préserver l’esthétique du vêtement'],
    faq: [
      {
        question: 'Est-ce uniquement pour du médical ?',
        answer: 'Non, l’accessibilité peut concerner le quotidien : vêtement, accessoire ou objet textile conçu pour simplifier le geste.',
      },
      {
        question: 'Comment régler l’effort d’ouverture ?',
        answer: 'La force est cadrée par la largeur, le nombre de points, la distance entre polarités et la manière d’ouvrir par pelage.',
      },
    ],
    recommendedProducts: ['Zips magnétiques', 'Fourreaux', 'Bureau d’étude / intégration'],
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 1,
    title: 'Cadrage',
    description: 'Comprendre le produit, le geste attendu, les contraintes de textile, de tension, de lavage et d’usage.',
    image: '/images/cadrage-blueprint.png',
  },
  {
    id: 2,
    title: 'Architecture',
    description: 'Définir le format magnétique, le nombre de rangs, les polarités et le mode d’intégration.',
    image: '/images/schema-modules.png',
  },
  {
    id: 3,
    title: 'Prototype',
    description: 'Assembler une première solution pour valider le geste, la tenue, la souplesse et la perception du produit.',
    image: '/images/prototype-validation.jpg',
  },
  {
    id: 4,
    title: 'Validation série',
    description: 'Stabiliser le montage, préparer les échanges techniques et accompagner le passage vers la production.',
    image: '/images/prototype-cta.png',
  },
];

export const TRUST_BADGES = [
  { label: '9 brevets internationaux', value: 'propriété industrielle' },
  { label: 'Fondée en 2000', value: 'usine à Paris' },
  { label: 'Plusieurs armées', value: 'applications exigeantes' },
  { label: 'Made in France', value: 'production et savoir-faire' },
];

export const TECHNOLOGY_CAPABILITIES: Capability[] = [
  {
    title: 'Polarités alternées',
    text: 'La force utile vient d’une organisation du champ magnétique, pas d’un aimant isolé posé dans un textile.',
  },
  {
    title: 'Rail continu',
    text: 'Le système peut guider une fermeture sur une longueur, répartir le maintien et éviter un point dur unique.',
  },
  {
    title: 'Ouverture par pelage',
    text: 'L’ouverture progresse aimant après aimant, ce qui rend le geste plus naturel qu’un arrachement frontal.',
  },
  {
    title: 'Intégration textile',
    text: 'La solution est pensée avec le support : poche, couture, fourreau, finition extérieure et contraintes d’entretien.',
  },
];

export const TECHNOLOGY_COMPARISON = [
  { label: 'Velcro', value: 'bruyant, sensible aux fibres et moins premium au toucher' },
  { label: 'Zip classique', value: 'nécessite alignement, tirette et précision mécanique' },
  { label: 'Clip magnétique', value: 'utile en point local mais moins adapté à un rail textile continu' },
  { label: 'SYSTEMMAG', value: 'fermeture guidée, silencieuse, souple et intégrable dans le produit' },
];

export const PRODUCT_DECISION_PATHS = [
  {
    title: 'Fermer une ouverture',
    text: 'Vous cherchez un geste linéaire, réversible et lisible.',
    target: 'Zips magnétiques',
  },
  {
    title: 'Créer une force répartie',
    text: 'Vous devez maintenir un rabat, une poche ou un assemblage technique.',
    target: 'Bandes / Blocs d’aimants',
  },
  {
    title: 'Protéger et cacher le système',
    text: 'Vous devez conserver une finition textile propre.',
    target: 'Fourreaux',
  },
  {
    title: 'Définir une solution nouvelle',
    text: 'Votre contrainte nécessite essais, architecture et validation.',
    target: 'Bureau d’étude / intégration',
  },
];

export const ABOUT_TIMELINE = [
  { label: '1998', value: 'premiers travaux sur les systèmes magnétiques appliqués au textile' },
  { label: '2000', value: 'création de SYSTEMMAG à Paris' },
  { label: '2005', value: 'validation scientifique et structuration industrielle' },
  { label: '2014+', value: 'applications dans des secteurs techniques et opérationnels exigeants' },
  { label: 'Aujourd’hui', value: '9 brevets internationaux, usine parisienne, intégrations sur mesure' },
];

export const PRESS_ITEMS: PressItem[] = [
  { media: 'Télé Matin', date: 'Janvier 2004', format: 'TV' },
  { media: 'France Info', date: 'Juillet 2004', format: 'Radio' },
  { media: 'Nostalgie', date: 'Novembre 2004', format: 'Radio' },
  { media: 'Le Figaro Entreprises', date: '1er juin 2004', format: 'Presse' },
  { media: 'Marie Claire', date: 'Octobre 2005', format: 'Presse' },
  { media: 'Acquire Magazine', date: 'Décembre 2022', format: 'Presse internationale' },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Pourquoi une fermeture magnétique textile ne se choisit pas comme un composant',
    slug: 'fermeture-magnetique-textile-architecture',
    excerpt: 'Une fermeture magnétique réussie dépend du geste, du support et de la façon dont la force est répartie dans le produit.',
    coverImage: '/images/technology-hero-ai-workbench.png',
    category: 'Technologie',
    author: 'SYSTEMMAG',
    publishDate: '2026-06-12',
    seoTitle: 'Fermeture magnétique textile : principe et architecture',
    seoDescription: 'Comprendre comment cadrer une fermeture magnétique textile autour du geste, du support et de la force utile.',
    body: [
      {
        title: 'Partir du geste',
        text: 'Le premier sujet n’est pas la taille d’un composant, mais la manière dont l’utilisateur va fermer, ouvrir, tirer, peler ou manipuler le produit.',
      },
      {
        title: 'Dimensionner la force',
        text: 'La largeur, le nombre de rangs, la distance entre polarités et le support textile définissent une sensation d’usage autant qu’une performance mécanique.',
      },
      {
        title: 'Valider avant la série',
        text: 'Un prototype permet d’arbitrer la force, la souplesse, la finition et les contraintes de production avant d’engager le produit final.',
      },
    ],
  },
  {
    title: 'Fermeture silencieuse, gantée, accessible : trois contraintes qui changent le design',
    slug: 'fermeture-silencieuse-gants-accessibilite',
    excerpt: 'Défense, sport, médical et mobilité réduite partagent une même attente : un geste qui reste lisible quand la précision manque.',
    coverImage: '/images/markets-hero-collage.png',
    category: 'Marchés',
    author: 'SYSTEMMAG',
    publishDate: '2026-06-12',
    seoTitle: 'Fermeture magnétique pour gants, silence et accessibilité',
    seoDescription: 'Applications d’une fermeture magnétique textile quand l’utilisateur porte des gants ou dispose d’une précision limitée.',
    body: [
      {
        title: 'Silence',
        text: 'Un système intégré évite les bruits de grattage ou les pièces mécaniques visibles quand la discrétion compte.',
      },
      {
        title: 'Gants',
        text: 'L’auto-positionnement permet de fermer sans chercher un point précis, ce qui change l’expérience sur un équipement technique.',
      },
      {
        title: 'Accessibilité',
        text: 'Une ouverture progressive par pelage peut rendre le geste plus tolérant pour des personnes qui ont moins de force ou de précision.',
      },
    ],
  },
  {
    title: 'Du prototype à la série : comment cadrer une intégration magnétique',
    slug: 'prototype-serie-integration-magnetique',
    excerpt: 'Cadrage, architecture, prototype et validation : une méthode pour transformer une contrainte d’usage en solution industrialisable.',
    coverImage: '/images/prototype-validation.jpg',
    category: 'Savoir-faire',
    author: 'SYSTEMMAG',
    publishDate: '2026-06-12',
    seoTitle: 'Intégration magnétique textile : du prototype à la série',
    seoDescription: 'Méthode de cadrage pour une intégration magnétique textile avec prototype et validation série.',
    body: [
      {
        title: 'Cadrage',
        text: 'Le projet commence par le produit, l’utilisateur, le support, l’entretien et le niveau de force attendu.',
      },
      {
        title: 'Architecture',
        text: 'Les polarités, rangs, fourreaux et points de couture sont définis avant la réalisation du prototype.',
      },
      {
        title: 'Validation',
        text: 'La solution est stabilisée autour de la perception du geste, de la tenue et de la manière dont elle sera produite.',
      },
    ],
  },
];

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: 'legal',
    title: 'Mentions légales',
    intro: 'Informations administratives et responsabilité éditoriale du site SYSTEMMAG.',
    sections: [
      { title: 'Éditeur', text: 'SYSTEMMAG, 20 rue Bouvier, 75011 Paris, France. Contact : contact@systemmag.com.' },
      { title: 'Contenu', text: 'Les informations techniques sont fournies pour orienter un échange de cadrage et ne remplacent pas une validation projet.' },
      { title: 'Propriété intellectuelle', text: 'Les marques, visuels, textes et éléments techniques restent la propriété de leurs titulaires respectifs.' },
    ],
  },
  {
    slug: 'privacy',
    title: 'Confidentialité',
    intro: 'Politique de confidentialité synthétique pour les demandes de contact et d’échantillons.',
    sections: [
      { title: 'Données collectées', text: 'Les formulaires peuvent collecter nom, entreprise, email, téléphone, secteur et description du projet.' },
      { title: 'Finalité', text: 'Ces données servent uniquement à qualifier une demande technique, commerciale ou documentaire.' },
      { title: 'Contact', text: 'Toute demande liée aux données personnelles peut être adressée à contact@systemmag.com.' },
    ],
  },
];
