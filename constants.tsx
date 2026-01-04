
import React from 'react';
import { 
  Book, 
  Layers, 
  Users, 
  Activity, 
  ShieldAlert, 
  History,
  Fingerprint,
  Scale,
  Zap,
  Anchor,
  Globe,
  Maximize2,
  GitCompare,
  MessageSquare,
  Eye,
  Scissors,
  Archive
} from 'lucide-react';
import { AnalysisTab, TheoryLens } from './types';

export const NAVIGATION_ITEMS: { id: AnalysisTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Dashboard', icon: <Book className="w-5 h-5" /> },
  { id: 'canonical', label: 'Analyse Canonique', icon: <History className="w-5 h-5" /> },
  { id: 'thematic', label: 'Thématique', icon: <Layers className="w-5 h-5" /> },
  { id: 'materiality', label: 'Matérialité Textuelle', icon: <Archive className="w-5 h-5" /> },
  { id: 'characters', label: 'Personnages', icon: <Users className="w-5 h-5" /> },
  { id: 'theoretical', label: 'Théorie Littéraire', icon: <ShieldAlert className="w-5 h-5" /> },
  { id: 'comparative', label: 'Mode Comparatif', icon: <GitCompare className="w-5 h-5" /> },
  { id: 'stylistic', label: 'Stylistique', icon: <Fingerprint className="w-5 h-5" /> },
  { id: 'critical', label: 'Zone Critique', icon: <Activity className="w-5 h-5" /> },
];

export const THEORETICAL_LENSES: { id: TheoryLens; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'structuralism', label: 'Structuralisme', icon: <Scale className="w-5 h-5" />, description: "Analyse des fonctions, invariants et oppositions binaires." },
  { id: 'narratology', label: 'Narratologie', icon: <MessageSquare className="w-5 h-5" />, description: "Comment l'histoire est racontée (voix, temps, niveaux)." },
  { id: 'psychoanalysis', label: 'Psychanalyse', icon: <Zap className="w-5 h-5" />, description: "Désirs, manques, refoulements et structures psychiques." },
  { id: 'marxism', label: 'Marxisme', icon: <Anchor className="w-5 h-5" />, description: "Rapports de force, classes sociales et idéologies matérielles." },
  { id: 'feminism', label: 'Féminisme / Genre', icon: <Maximize2 className="w-5 h-5" />, description: "Agency, distribution du pouvoir et voix marginalisées." },
  { id: 'postcolonialism', label: 'Postcolonialisme', icon: <Globe className="w-5 h-5" />, description: "Centre/Périphérie, altérité et hybridation culturelle." },
  { id: 'receptionAesthetics', label: 'Esthétique de la réception', icon: <Eye className="w-5 h-5" />, description: "Que fait le texte au lecteur ? Horizon d'attente." },
  { id: 'deconstruction', label: 'Déconstruction', icon: <Scissors className="w-5 h-5" />, description: "Où le texte se contredit-il ? Paradoxes et instabilité." },
];
