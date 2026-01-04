
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
              weight: { type: Type.NUMBER, description: "Scale 0-100" },
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
            } 
          } 
        },
        correlations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING },
              character: { type: Type.STRING },
              intensity: { type: Type.NUMBER, description: "Scale 0-100" }
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
                  }
                }
              }
            }
          }
        },
        lexicalObsessions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
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
            }
          }
        },
        translationGaps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              targetLanguage: { type: Type.STRING },
              gapAnalysis: { type: Type.STRING }
            }
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
              agency: { type: Type.NUMBER, description: "Scale 0-100" },
              iconType: { type: Type.STRING, enum: ['hero', 'villain', 'mentor', 'ally', 'sidekick'] }
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
              type: { type: Type.STRING, enum: ['conflict', 'love', 'kinship', 'mentor', 'neutral'] },
              strength: { type: Type.NUMBER, description: "Scale 1-10" }
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
            functions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { function: { type: Type.STRING }, scenes: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
            binaryOppositions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { left: { type: Type.STRING }, right: { type: Type.STRING }, synthesis: { type: Type.STRING } } } },
            blindSpot: { type: Type.STRING }
          }
        },
        narratology: {
          type: Type.OBJECT,
          properties: {
            focalizationDeep: { type: Type.STRING },
            temporalStructure: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, impact: { type: Type.STRING } } },
            narrativeLevels: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { level: { type: Type.STRING }, description: { type: Type.STRING } } } },
            blindSpot: { type: Type.STRING }
          }
        },
        psychoanalysis: {
          type: Type.OBJECT,
          properties: {
            drives: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { character: { type: Type.STRING }, drive: { type: Type.STRING }, manifestation: { type: Type.STRING } } } },
            consciousUnconscious: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { character: { type: Type.STRING }, conscious: { type: Type.STRING }, unconscious: { type: Type.STRING } } } },
            blindSpot: { type: Type.STRING }
          }
        },
        marxism: {
          type: Type.OBJECT,
          properties: {
            socialPositions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { character: { type: Type.STRING }, class: { type: Type.STRING }, status: { type: Type.STRING } } } },
            ideology: { type: Type.STRING },
            dominationGraphe: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, dominant: { type: Type.BOOLEAN }, object: { type: Type.STRING } } } },
            blindSpot: { type: Type.STRING }
          }
        },
        feminism: {
          type: Type.OBJECT,
          properties: {
            agencyMatrix: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { character: { type: Type.STRING }, agencyScore: { type: Type.NUMBER, description: "Scale 0-100" }, powerSource: { type: Type.STRING } } } },
            symbolicPower: { type: Type.STRING },
            blindSpot: { type: Type.STRING }
          }
        },
        postcolonialism: {
          type: Type.OBJECT,
          properties: {
            symbolicMap: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { place: { type: Type.STRING }, status: { type: Type.STRING }, meaning: { type: Type.STRING } } } },
            otherness: { type: Type.ARRAY, items: { type: Type.STRING } },
            blindSpot: { type: Type.STRING }
          }
        },
        receptionAesthetics: {
          type: Type.OBJECT,
          properties: {
            horizonOfExpectation: { type: Type.STRING },
            indeterminacyZones: { type: Type.ARRAY, items: { type: Type.STRING } },
            readerResponse: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { effect: { type: Type.STRING }, intensity: { type: Type.NUMBER, description: "Scale 0-100" } } } },
            blindSpot: { type: Type.STRING }
          }
        },
        deconstruction: {
          type: Type.OBJECT,
          properties: {
            implicitHierarchies: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { superior: { type: Type.STRING }, inferior: { type: Type.STRING }, subversion: { type: Type.STRING } } } },
            paradoxes: { type: Type.ARRAY, items: { type: Type.STRING } },
            instabilityOfMeaning: { type: Type.STRING },
            blindSpot: { type: Type.STRING }
          }
        }
      }
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
              workValue: { type: Type.NUMBER, description: "Scale 0-100" },
              corpusValue: { type: Type.NUMBER, description: "Scale 0-100" }
            }
          }
        },
        gapAnalysis: { type: Type.STRING }
      }
    },
    stylistic: {
      type: Type.OBJECT,
      properties: {
        avgSentenceLength: { type: Type.NUMBER },
        metaphorDensity: { type: Type.NUMBER, description: "Scale 0-10" },
        dominantLexicalFields: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
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
            }
          }
        },
        unreadable: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  },
  required: ["title", "author", "summary", "canonical", "thematic", "materiality", "characters", "theoretical", "comparative", "stylistic", "criticalZone"]
};

export const generateAnalysis = async (title: string, language: string): Promise<AnalysisDossier> => {
  const model = "gemini-3-pro-preview";
  const prompt = `Perform an extremely detailed literary deconstruction of the book: "${title}".
  Respond strictly in the language: ${language}.
  
  NUMERIC CONSTRAINTS (MANDATORY):
  - Agency, intensity, theme weights, and divergence metrics MUST BE integers between 0 and 100.
  - Relationship strength MUST BE between 1 and 10.
  - Metaphor density MUST BE between 0 and 10.
  
  CHARACTER GRAPH REQUIREMENTS:
  - Identify 8 to 12 significant characters.
  - Assign each an 'iconType' from: 'hero', 'villain', 'mentor', 'ally', 'sidekick'.
  - Map their relationships using 'type' from: 'conflict', 'love', 'kinship', 'mentor', 'neutral'.
  
  THEORETICAL MODULES (EXPLICIT):
  - Theme Evolution: Track the intensity of at least 3 main themes across the narrative structure.
  - Materiality: Analyze authorship (pseudonyms, collaborations), publication history, editorial cuts, and significant translation gaps.
  - Lexical Obsessions: Identify recurring words/fields for each major theme.
  - Motifs: Deep dive into at least 4 symbolic elements.
  
  Return the output strictly in the requested JSON format. Ensure high academic depth.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema as any,
    },
  });

  return JSON.parse(response.text || "{}");
};
