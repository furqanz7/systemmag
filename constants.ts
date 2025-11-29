import { AwarenessStage, ValueProp } from './types';

export const APP_NAME = "SYSTEMMAG";
export const TAGLINE = "La Fin du Zip.";

export const AWARENESS_STAGES: AwarenessStage[] = [
  {
    id: 1,
    label: "INCONSCIENT",
    mindset: "\"C'est juste une fermeture éclair. Si elle casse, je la remplace.\"",
    strategy: "DISRUPT : Montrer l'échec qu'ils acceptent comme normal (Obsolescence).",
    active: true
  },
  {
    id: 2,
    label: "CONSCIENT DU PROBLÈME",
    mindset: "\"Je déteste quand ce zip se bloque dans le froid ou avec des gants.\"",
    strategy: "AGITATE : \"Un zip bloqué sur le terrain n'est pas une gêne, c'est un échec de mission.\"",
    active: false
  },
  {
    id: 3,
    label: "CONSCIENT DE LA SOLUTION",
    mindset: "\"Il me faut une fermeture magnétique, peut-être du Velcro ?\"",
    strategy: "EDUCATE : Le Velcro est bruyant et s'use. Les aimants classiques sont faibles. Il vous faut la technologie Systemmag.",
    active: false
  },
  {
    id: 4,
    label: "CONSCIENT DU PRODUIT",
    mindset: "\"Systemmag est la seule solution magnétique de grade militaire.\"",
    strategy: "CONVERT : Le standard Deeptech pour le Luxe Industriel. Devenir la référence.",
    active: false
  }
];

export const VALUE_PROPS: ValueProp[] = [
  { title: "SANS FRICTION", desc: "L'échec mécanique est mathématiquement impossible." },
  { title: "SILENCIEUX", desc: "Opération furtive. Pas de bruit de déchirement. Pas de clic." },
  { title: "INSTANTANÉ", desc: "Fermeture auto-alignée. Engagement en 0.2s." }
];

export const DISTRIBUTOR_DATA = {
  current: {
    name: "MODÈLE DISTRIBUTEUR",
    intermediary: "A+ Products",
    drawback: "Perte de Données & Marque",
    status: "PASSÉ",
    color: "text-gray-500"
  },
  future: {
    name: "AUTORITÉ DIRECTE",
    intermediary: "Inbound Direct",
    drawback: "Contrôle Total & Marge",
    status: "FUTUR",
    color: "text-industrial-accent"
  }
};