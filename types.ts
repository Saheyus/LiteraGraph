
export interface Character {
  name: string;
  role: string;
  archetype: string;
  description: string;
  agency: number; // 0 to 100
  iconType: 'hero' | 'villain' | 'mentor' | 'ally' | 'sidekick';
}

export interface Relationship {
  source: string;
  target: string;
  type: 'conflict' | 'love' | 'kinship' | 'mentor' | 'neutral';
  strength: number; // 1 to 10
}

export interface Theme {
  label: string;
  weight: number;
  description: string;
}

export interface ThemeEvolution {
  theme: string;
  progression: { stage: string; intensity: number }[];
}

export interface ComparativeMetric {
  subject: string;
  workValue: number;
  corpusValue: number;
}

export interface AnalysisDossier {
  title: string;
  author: string;
  summary: string;
  canonical: {
    acts: { title: string; events: string[] }[];
    timeline: { date: string; event: string }[];
    focalization: string;
    narrativeVoice: string;
  };
  thematic: {
    mainThemes: Theme[];
    motifs: { label: string; symbolism: string }[];
    correlations: { theme: string; character: string; intensity: number }[];
    themeEvolution: ThemeEvolution[];
    lexicalObsessions: { theme: string; keywords: string[] }[];
  };
  materiality: {
    authorshipDetails: string;
    publicationConditions: string;
    editorialConstraints: string[];
    versionsAndRewrites: { label: string; description: string }[];
    translationGaps: { targetLanguage: string; gapAnalysis: string }[];
  };
  characters: {
    list: Character[];
    relationships: Relationship[];
  };
  theoretical: {
    structuralism: {
      functions: { function: string; scenes: string[] }[];
      binaryOppositions: { left: string; right: string; synthesis: string }[];
      blindSpot: string;
    };
    psychoanalysis: {
      drives: { character: string; drive: string; manifestation: string }[];
      consciousUnconscious: { character: string; conscious: string; unconscious: string }[];
      blindSpot: string;
    };
    marxism: {
      socialPositions: { character: string; class: string; status: string }[];
      ideology: string;
      dominationGraphe: { subject: string; dominant: boolean; object: string }[];
      blindSpot: string;
    };
    feminism: {
      agencyMatrix: { character: string; agencyScore: number; powerSource: string }[];
      symbolicPower: string;
      blindSpot: string;
    };
    postcolonialism: {
      symbolicMap: { place: string; status: 'Center' | 'Periphery' | 'Hybrid'; meaning: string }[];
      otherness: string[];
      blindSpot: string;
    };
    narratology: {
      focalizationDeep: string;
      temporalStructure: { type: string; impact: string };
      narrativeLevels: { level: string; description: string }[];
      blindSpot: string;
    };
    receptionAesthetics: {
      horizonOfExpectation: string;
      indeterminacyZones: string[];
      readerResponse: { effect: string; intensity: number }[];
      blindSpot: string;
    };
    deconstruction: {
      implicitHierarchies: { superior: string; inferior: string; subversion: string }[];
      paradoxes: string[];
      instabilityOfMeaning: string;
      blindSpot: string;
    };
  };
  comparative: {
    contemporaries: string[];
    authorialContext: string;
    theoreticalDivergence: ComparativeMetric[];
    gapAnalysis: string;
  };
  stylistic: {
    avgSentenceLength: number;
    metaphorDensity: number;
    dominantLexicalFields: string[];
    fingerprint: {
      complexity: number;
      richness: number;
      cohesion: number;
      abundance: number;
      innovation: number;
    };
  };
  criticalZone: {
    tensions: string[];
    contradictoryReadings: { theory: string; perspective: string }[];
    unreadable: string[];
  };
}

export type AnalysisTab = 
  | 'overview' 
  | 'canonical' 
  | 'thematic' 
  | 'materiality'
  | 'characters' 
  | 'theoretical' 
  | 'comparative'
  | 'stylistic' 
  | 'critical';

export type TheoryLens = 
  | 'structuralism' 
  | 'psychoanalysis' 
  | 'marxism' 
  | 'feminism' 
  | 'postcolonialism'
  | 'narratology'
  | 'receptionAesthetics'
  | 'deconstruction';
