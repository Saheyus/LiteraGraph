
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisDossier } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    author: { type: Type.STRING },
    summary: { type: Type.STRING },
    canonical: {
      type: Type.OBJECT,
      properties: {
        acts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              events: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "events"]
          }
        },
        timeline: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              event: { type: Type.STRING }
            },
            required: ["date", "event"]
          }
        },
        focalization: { type: Type.STRING },
        narrativeVoice: { type: Type.STRING }
      },
      required: ["acts", "timeline", "focalization", "narrativeVoice"]
    },
    thematic: {
      type: Type.OBJECT,
      properties: {
        mainThemes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              weight: { type: Type.NUMBER },
              description: { type: Type.STRING }
            },
            required: ["label", "weight", "description"]
          }
        },
        motifs: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT, 
            properties: { 
              label: { type: Type.STRING }, 
              symbolism: { type: Type.STRING } 
            },
            required: ["label", "symbolism"]
          } 
        },
        correlations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING },
              character: { type: Type.STRING },
              intensity: { type: Type.NUMBER }
            },
            required: ["theme", "character", "intensity"]
          }
        },
        themeEvolution: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING },
              progression: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stage: { type: Type.STRING },
                    intensity: { type: Type.NUMBER }
                  },
                  required: ["stage", "intensity"]
                }
              }
            },
            required: ["theme", "progression"]
          }
        },
        lexicalObsessions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["theme", "keywords"]
          }
        }
      },
      required: ["mainThemes", "motifs", "correlations", "themeEvolution", "lexicalObsessions"]
    },
    materiality: {
      type: Type.OBJECT,
      properties: {
        authorshipDetails: { type: Type.STRING },
        publicationConditions: { type: Type.STRING },
        editorialConstraints: { type: Type.ARRAY, items: { type: Type.STRING } },
        versionsAndRewrites: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["label", "description"]
          }
        },
        translationGaps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              targetLanguage: { type: Type.STRING },
              gapAnalysis: { type: Type.STRING }
            },
            required: ["targetLanguage", "gapAnalysis"]
          }
        }
      },
      required: ["authorshipDetails", "publicationConditions", "editorialConstraints", "versionsAndRewrites", "translationGaps"]
    },
    characters: {
      type: Type.OBJECT,
      properties: {
        list: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              archetype: { type: Type.STRING },
              description: { type: Type.STRING },
              agency: { type: Type.NUMBER },
              iconType: { type: Type.STRING }
            },
            required: ["name", "role", "archetype", "description", "agency", "iconType"]
          }
        },
        relationships: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING },
              target: { type: Type.STRING },
              type: { type: Type.STRING },
              strength: { type: Type.NUMBER }
            },
            required: ["source", "target", "type", "strength"]
          }
        }
      },
      required: ["list", "relationships"]
    },
    theoretical: {
      type: Type.OBJECT,
      properties: {
        structuralism: {
          type: Type.OBJECT,
          properties: {
            functions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { function: { type: Type.STRING }, scenes: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["function", "scenes"] } },
            binaryOppositions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { left: { type: Type.STRING }, right: { type: Type.STRING }, synthesis: { type: Type.STRING } }, required: ["left", "right", "synthesis"] } },
            blindSpot: { type: Type.STRING }
          },
          required: ["functions", "binaryOppositions", "blindSpot"]
        },
        narratology: {
          type: Type.OBJECT,
          properties: {
            focalizationDeep: { type: Type.STRING },
            temporalStructure: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, impact: { type: Type.STRING } }, required: ["type", "impact"] },
            narrativeLevels: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { level: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["level", "description"] } },
            blindSpot: { type: Type.STRING }
          },
          required: ["focalizationDeep", "temporalStructure", "narrativeLevels", "blindSpot"]
        },
        psychoanalysis: {
          type: Type.OBJECT,
          properties: {
            drives: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { character: { type: Type.STRING }, drive: { type: Type.STRING }, manifestation: { type: Type.STRING } }, required: ["character", "drive", "manifestation"] } },
            consciousUnconscious: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { character: { type: Type.STRING }, conscious: { type: Type.STRING }, unconscious: { type: Type.STRING } }, required: ["character", "conscious", "unconscious"] } },
            blindSpot: { type: Type.STRING }
          },
          required: ["drives", "consciousUnconscious", "blindSpot"]
        },
        marxism: {
          type: Type.OBJECT,
          properties: {
            socialPositions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { character: { type: Type.STRING }, class: { type: Type.STRING }, status: { type: Type.STRING } }, required: ["character", "class", "status"] } },
            ideology: { type: Type.STRING },
            dominationGraphe: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, dominant: { type: Type.BOOLEAN }, object: { type: Type.STRING } }, required: ["subject", "dominant", "object"] } },
            blindSpot: { type: Type.STRING }
          },
          required: ["socialPositions", "ideology", "dominationGraphe", "blindSpot"]
        },
        feminism: {
          type: Type.OBJECT,
          properties: {
            agencyMatrix: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { character: { type: Type.STRING }, agencyScore: { type: Type.NUMBER }, powerSource: { type: Type.STRING } }, required: ["character", "agencyScore", "powerSource"] } },
            symbolicPower: { type: Type.STRING },
            blindSpot: { type: Type.STRING }
          },
          required: ["agencyMatrix", "symbolicPower", "blindSpot"]
        },
        postcolonialism: {
          type: Type.OBJECT,
          properties: {
            symbolicMap: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { place: { type: Type.STRING }, status: { type: Type.STRING }, meaning: { type: Type.STRING } }, required: ["place", "status", "meaning"] } },
            otherness: { type: Type.ARRAY, items: { type: Type.STRING } },
            blindSpot: { type: Type.STRING }
          },
          required: ["symbolicMap", "otherness", "blindSpot"]
        },
        receptionAesthetics: {
          type: Type.OBJECT,
          properties: {
            horizonOfExpectation: { type: Type.STRING },
            indeterminacyZones: { type: Type.ARRAY, items: { type: Type.STRING } },
            readerResponse: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { effect: { type: Type.STRING }, intensity: { type: Type.NUMBER } }, required: ["effect", "intensity"] } },
            blindSpot: { type: Type.STRING }
          },
          required: ["horizonOfExpectation", "indeterminacyZones", "readerResponse", "blindSpot"]
        },
        deconstruction: {
          type: Type.OBJECT,
          properties: {
            implicitHierarchies: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { superior: { type: Type.STRING }, inferior: { type: Type.STRING }, subversion: { type: Type.STRING } }, required: ["superior", "inferior", "subversion"] } },
            paradoxes: { type: Type.ARRAY, items: { type: Type.STRING } },
            instabilityOfMeaning: { type: Type.STRING },
            blindSpot: { type: Type.STRING }
          },
          required: ["implicitHierarchies", "paradoxes", "instabilityOfMeaning", "blindSpot"]
        }
      },
      required: ["structuralism", "narratology", "psychoanalysis", "marxism", "feminism", "postcolonialism", "receptionAesthetics", "deconstruction"]
    },
    comparative: {
      type: Type.OBJECT,
      properties: {
        contemporaries: { type: Type.ARRAY, items: { type: Type.STRING } },
        authorialContext: { type: Type.STRING },
        theoreticalDivergence: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              workValue: { type: Type.NUMBER },
              corpusValue: { type: Type.NUMBER }
            },
            required: ["subject", "workValue", "corpusValue"]
          }
        },
        gapAnalysis: { type: Type.STRING }
      },
      required: ["contemporaries", "authorialContext", "theoreticalDivergence", "gapAnalysis"]
    },
    stylistic: {
      type: Type.OBJECT,
      properties: {
        avgSentenceLength: { type: Type.NUMBER },
        metaphorDensity: { type: Type.NUMBER },
        dominantLexicalFields: { type: Type.ARRAY, items: { type: Type.STRING } },
        fingerprint: {
          type: Type.OBJECT,
          properties: {
            complexity: { type: Type.NUMBER },
            richness: { type: Type.NUMBER },
            cohesion: { type: Type.NUMBER },
            abundance: { type: Type.NUMBER },
            innovation: { type: Type.NUMBER }
          },
          required: ["complexity", "richness", "cohesion", "abundance", "innovation"]
        }
      },
      required: ["avgSentenceLength", "metaphorDensity", "dominantLexicalFields", "fingerprint"]
    },
    criticalZone: {
      type: Type.OBJECT,
      properties: {
        tensions: { type: Type.ARRAY, items: { type: Type.STRING } },
        contradictoryReadings: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              theory: { type: Type.STRING },
              perspective: { type: Type.STRING }
            },
            required: ["theory", "perspective"]
          }
        },
        unreadable: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["tensions", "contradictoryReadings", "unreadable"]
    }
  },
  required: ["title", "author", "summary", "canonical", "thematic", "materiality", "characters", "theoretical", "comparative", "stylistic", "criticalZone"]
};

export const generateAnalysis = async (title: string, language: string): Promise<AnalysisDossier> => {
  const model = "gemini-3-pro-preview";
  const prompt = `Deconstruct the book: "${title}" in ${language}. 
  Depth: Academic/Theoretical.
  
  Constraints:
  - Max 10 characters in 'list'.
  - MUST include at least one relationship for EVERY character in the list. Source/Target must match character names exactly.
  - Standard Relationship types: 'conflict', 'love', 'kinship', 'mentor', 'neutral'.
  - Standard Archetypes: 'hero', 'villain', 'mentor', 'ally', 'sidekick'.
  - Max 4 items per array in theoretical modules.
  - All numeric values MUST be integers 0-100.
  - No empty strings.
  
  Format: Strict JSON matching the provided schema.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema as any,
      thinkingConfig: { thinkingBudget: 32000 }
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (err) {
    console.error("JSON Parsing Error");
    throw err;
  }
};
