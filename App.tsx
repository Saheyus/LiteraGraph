
import React, { useState } from 'react';
import { Search, Loader2, Info, ShieldAlert, Layers, Book, EyeOff, GitCompare, Layout, Languages, MessageSquare, Eye, Scissors, Hash, Archive, FileText, Globe2, PenTool } from 'lucide-react';
import { NAVIGATION_ITEMS, THEORETICAL_LENSES } from './constants';
import { AnalysisTab, AnalysisDossier, TheoryLens } from './types';
import { generateAnalysis } from './services/geminiService';
import { CharacterGraph, ThemeCloud, RadarComparison, Heatmap, DivergenceChart, ThemeEvolutionChart } from './components/Visualizers';

const LANGUAGES = [
  { id: 'anglais', label: 'English', flag: '🇬🇧' },
  { id: 'français', label: 'Français', flag: '🇫🇷' },
  { id: 'espagnol', label: 'Español', flag: '🇪🇸' },
  { id: 'allemand', label: 'Deutsch', flag: '🇩🇪' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('overview');
  const [activeLens, setActiveLens] = useState<TheoryLens>('structuralism');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('français');
  const [loading, setLoading] = useState(false);
  const [dossier, setDossier] = useState<AnalysisDossier | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const data = await generateAnalysis(searchQuery, selectedLanguage);
      setDossier(data);
      setActiveTab('overview');
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Une erreur est survenue lors de l'analyse. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!dossier) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h1 className="serif text-4xl font-bold text-slate-900 mb-2">{dossier.title}</h1>
                <p className="text-xl text-slate-500 mb-6 italic">{dossier.author}</p>
                <div className="prose max-w-none text-slate-700 leading-relaxed">
                  <p>{dossier.summary}</p>
                </div>
              </div>
              <div className="md:w-80 space-y-4">
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                  <h3 className="font-bold text-indigo-900 mb-2">Statistiques de style</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Phrases (mots)</span>
                      <span className="font-bold">{dossier.stylistic?.avgSentenceLength || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Métaphores</span>
                      <span className="font-bold">{dossier.stylistic?.metaphorDensity || 0}/10</span>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-bold text-emerald-900 mb-2">Voix Narrative</h3>
                  <p className="text-emerald-800 text-sm">{dossier.canonical?.narrativeVoice}</p>
                  <p className="text-emerald-700 text-xs mt-2 uppercase tracking-wider font-semibold">Focalisation: {dossier.canonical?.focalization}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ThemeCloud themes={dossier.thematic?.mainThemes || []} />
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Aperçu Personnages</h3>
                <div className="space-y-4">
                  {(dossier.characters?.list || []).slice(0, 4).map((c, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {c.name?.[0] || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 leading-tight">{c.name}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-tight">{c.role} | {c.archetype}</p>
                      </div>
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${c.agency}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'canonical':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-slate-900">Structure Narrative (Actes)</h3>
                <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {(dossier.canonical?.acts || []).map((act, i) => (
                    <div key={i} className="pl-10 relative">
                      <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-white border-4 border-indigo-500 z-10"></div>
                      <h4 className="font-bold text-slate-800 text-lg mb-2">{act.title}</h4>
                      <ul className="space-y-1 list-disc list-inside text-slate-600 text-sm">
                        {act.events?.map((ev, j) => <li key={j}>{ev}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Temporalité</h3>
                <div className="space-y-4">
                  {(dossier.canonical?.timeline || []).map((item, i) => (
                    <div key={i} className="flex gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className="font-bold text-indigo-600 text-sm shrink-0">{item.date}</div>
                      <div className="text-sm text-slate-700">{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'thematic':
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[450px]">
              <ThemeCloud themes={dossier.thematic?.mainThemes || []} />
              <ThemeEvolutionChart data={dossier.thematic?.themeEvolution || []} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-indigo-500" /> Obsessions Lexicales (Champs Sémantiques)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(dossier.thematic?.lexicalObsessions || []).map((obs, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tighter">{obs.theme}</div>
                      <div className="flex flex-wrap gap-2">
                        {obs.keywords?.map((kw, j) => (
                          <span key={j} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded text-slate-500 italic">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Motifs & Symbolisme</h3>
                <div className="space-y-4">
                  {(dossier.thematic?.motifs || []).map((m, i) => (
                    <div key={i} className="group p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all">
                      <div className="font-bold text-amber-900 text-sm mb-1">{m.label}</div>
                      <p className="text-[11px] text-amber-800 leading-tight opacity-80 group-hover:opacity-100 transition-opacity">
                        {m.symbolism}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Matrice de corrélation Thèmes × Personnages</h3>
              <Heatmap data={dossier.thematic?.correlations || []} />
            </div>
          </div>
        );

      case 'materiality':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-amber-50/50 p-8 rounded-2xl border border-amber-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-amber-900 flex items-center gap-2">
                   <PenTool className="w-6 h-6" /> Genèse & Autorat
                </h3>
                <p className="text-amber-800 leading-relaxed italic mb-6">
                  {dossier.materiality?.authorshipDetails}
                </p>
                <div className="p-5 bg-white rounded-xl border border-amber-100">
                   <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Conditions de Publication</h4>
                   <p className="text-sm text-slate-700 leading-relaxed">{dossier.materiality?.publicationConditions}</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                 <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-slate-400" /> Contraintes & Versions
                 </h3>
                 <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-6">
                       {(dossier.materiality?.editorialConstraints || []).map((c, i) => (
                         <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium border border-slate-200">
                            {c}
                         </span>
                       ))}
                    </div>
                    <div className="space-y-4">
                       {(dossier.materiality?.versionsAndRewrites || []).map((v, i) => (
                         <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                            <h4 className="font-bold text-slate-900 text-sm">{v.label}</h4>
                            <p className="text-xs text-slate-500 italic mt-1">{v.description}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
               <h3 className="text-xl font-bold mb-6 text-indigo-400 flex items-center gap-2">
                  <Globe2 className="w-6 h-6" /> Traductions & Écarts Sémantiques
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(dossier.materiality?.translationGaps || []).map((g, i) => (
                    <div key={i} className="p-5 bg-slate-800 rounded-xl border border-slate-700">
                       <div className="font-bold text-indigo-300 mb-2 uppercase tracking-widest text-xs">{g.targetLanguage}</div>
                       <p className="text-sm text-slate-400 italic">"{g.gapAnalysis}"</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );

      case 'characters':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <CharacterGraph characters={dossier.characters?.list || []} relationships={dossier.characters?.relationships || []} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(dossier.characters?.list || []).map((c, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{c.name}</h4>
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{c.archetype}</p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{c.role}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3 italic">"{c.description}"</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>Agency</span>
                      <span>{c.agency}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${c.agency}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'theoretical':
        const currentLensData = dossier.theoretical?.[activeLens];
        return (
          <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
            <div className="lg:w-80 shrink-0 space-y-2">
              {THEORETICAL_LENSES.map(lens => (
                <button
                  key={lens.id}
                  onClick={() => setActiveLens(lens.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                    activeLens === lens.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1' 
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={activeLens === lens.id ? 'text-white' : 'text-indigo-600'}>
                    {lens.icon}
                  </div>
                  <div>
                    <div className="font-bold">{lens.label}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex-1 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[500px]">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{THEORETICAL_LENSES.find(l => l.id === activeLens)?.label}</h2>
                  <p className="text-slate-500">{THEORETICAL_LENSES.find(l => l.id === activeLens)?.description}</p>
                </div>

                {!currentLensData ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Info className="w-12 h-12 mb-4 opacity-20" />
                    <p className="italic">Données théoriques indisponibles pour cette grille.</p>
                  </div>
                ) : (
                  <>
                    {activeLens === 'structuralism' && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-slate-50 p-6 rounded-xl">
                            <h4 className="font-bold mb-4 text-indigo-900">Fonctions</h4>
                            <div className="space-y-4">
                              {(dossier.theoretical.structuralism.functions || []).map((f, i) => (
                                <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
                                  <div className="font-bold text-slate-800 text-sm mb-1">{f.function}</div>
                                  <div className="text-xs text-slate-500 italic">{f.scenes?.join(', ')}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-indigo-900 text-white p-6 rounded-xl">
                            <h4 className="font-bold mb-4 text-indigo-200">Oppositions Binaires</h4>
                            <div className="space-y-6">
                              {(dossier.theoretical.structuralism.binaryOppositions || []).map((op, i) => (
                                <div key={i} className="text-center relative py-4 border-b border-indigo-800 last:border-0">
                                  <div className="flex justify-between font-bold text-lg mb-2">
                                    <span>{op.left}</span>
                                    <span className="text-indigo-400">vs</span>
                                    <span>{op.right}</span>
                                  </div>
                                  <div className="text-sm italic opacity-60">Synthèse: {op.synthesis}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeLens === 'narratology' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800">
                            <h4 className="font-bold mb-4 text-indigo-400">Focalisation & Voix</h4>
                            <p className="leading-relaxed mb-4">{dossier.theoretical.narratology.focalizationDeep}</p>
                            <div className="p-4 bg-slate-800 rounded-lg">
                               <span className="text-xs font-bold text-indigo-300 uppercase block mb-1">Structure Temporelle</span>
                               <p className="font-bold text-lg">{dossier.theoretical.narratology.temporalStructure?.type}</p>
                               <p className="text-sm opacity-70 mt-1">{dossier.theoretical.narratology.temporalStructure?.impact}</p>
                            </div>
                          </div>
                          <div className="bg-white border border-slate-200 p-6 rounded-xl">
                            <h4 className="font-bold mb-4 text-slate-900">Niveaux Narratifs</h4>
                            <div className="space-y-4">
                              {(dossier.theoretical.narratology.narrativeLevels || []).map((lvl, i) => (
                                <div key={i} className="p-3 bg-slate-50 rounded-lg border-l-4 border-indigo-500">
                                  <div className="font-bold text-slate-800 text-sm">{lvl.level}</div>
                                  <div className="text-xs text-slate-500 mt-1">{lvl.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeLens === 'psychoanalysis' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
                          <h4 className="font-bold mb-4 text-rose-900">Désirs & Pulsions</h4>
                          <div className="space-y-4">
                            {(dossier.theoretical.psychoanalysis.drives || []).map((d, i) => (
                              <div key={i} className="flex gap-4 items-start">
                                <div className="font-bold text-rose-600 text-sm whitespace-nowrap">{d.character}</div>
                                <div className="text-sm">
                                  <span className="font-bold uppercase text-[10px] block">{d.drive}</span>
                                  <p className="text-rose-800 italic">{d.manifestation}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white border border-slate-200 p-6 rounded-xl">
                          <h4 className="font-bold mb-4 text-slate-900">Structures Psychiques</h4>
                          <RadarComparison data={(dossier.characters?.list || []).map(c => ({ subject: c.name, A: c.agency }))} />
                        </div>
                      </div>
                    )}

                    {activeLens === 'marxism' && (
                      <div className="space-y-6">
                        <div className="p-6 bg-slate-900 text-slate-300 rounded-xl">
                          <h4 className="font-bold mb-2 text-white">Idéologie Implicite</h4>
                          <p className="italic leading-relaxed">"{dossier.theoretical.marxism.ideology}"</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {(dossier.theoretical.marxism.socialPositions || []).map((p, i) => (
                            <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                              <div className="font-bold text-slate-900">{p.character}</div>
                              <div className="text-indigo-600 text-xs font-bold uppercase">{p.class}</div>
                              <div className="text-xs text-slate-500 mt-2">{p.status}</div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-white p-6 border border-slate-200 rounded-xl">
                          <h4 className="font-bold mb-4 text-slate-800 uppercase tracking-tighter">Graphe de Domination</h4>
                          <div className="space-y-2">
                             {(dossier.theoretical.marxism.dominationGraphe || []).map((d, i) => (
                               <div key={i} className="flex items-center gap-4 text-sm">
                                  <span className="font-bold text-slate-700 w-32">{d.subject}</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.dominant ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                     {d.dominant ? 'DOMINE' : 'EST DOMINÉ PAR'}
                                  </span>
                                  <span className="text-slate-500">{d.object}</span>
                               </div>
                             ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeLens === 'feminism' && (
                      <div className="space-y-6">
                        <div className="p-6 bg-purple-50 border border-purple-100 rounded-xl">
                          <h4 className="font-bold mb-2 text-purple-900">Pouvoir Symbolique</h4>
                          <p className="text-purple-800 italic">"{dossier.theoretical.feminism.symbolicPower}"</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {(dossier.theoretical.feminism.agencyMatrix || []).map((item, i) => (
                             <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl">
                                <div className="font-bold text-slate-900 mb-2">{item.character}</div>
                                <div className="flex items-center gap-2 mb-2">
                                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                     <div className="bg-purple-500 h-full" style={{ width: `${item.agencyScore}%` }}></div>
                                   </div>
                                   <span className="text-xs font-bold">{item.agencyScore}%</span>
                                </div>
                                <div className="text-xs text-slate-500 italic">Source: {item.powerSource}</div>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}

                    {activeLens === 'postcolonialism' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 px-1">Topographie Symbolique</h4>
                          {(dossier.theoretical.postcolonialism.symbolicMap || []).map((loc, i) => (
                            <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-800">{loc.place}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  loc.status === 'Center' ? 'bg-blue-100 text-blue-700' :
                                  loc.status === 'Periphery' ? 'bg-orange-100 text-orange-700' :
                                  'bg-green-100 text-green-700'
                                }`}>{loc.status}</span>
                              </div>
                              <p className="text-xs text-slate-500 italic">{loc.meaning}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-emerald-900 text-emerald-100 p-6 rounded-xl">
                           <h4 className="font-bold mb-4 text-emerald-400">Figures de l'Altérité</h4>
                           <ul className="space-y-4">
                              {(dossier.theoretical.postcolonialism.otherness || []).map((o, i) => (
                                <li key={i} className="text-sm italic border-b border-emerald-800 pb-2 last:border-0 leading-relaxed">
                                  "{o}"
                                </li>
                              ))}
                           </ul>
                        </div>
                      </div>
                    )}

                    {activeLens === 'receptionAesthetics' && (
                      <div className="space-y-6">
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                          <h4 className="font-bold mb-2 text-indigo-900">Horizon d'attente</h4>
                          <p className="text-indigo-800 leading-relaxed italic">"{dossier.theoretical.receptionAesthetics.horizonOfExpectation}"</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-6 border border-slate-100 rounded-xl">
                            <h4 className="font-bold mb-4 text-slate-900">Zones d'indétermination</h4>
                            <ul className="space-y-2">
                              {(dossier.theoretical.receptionAesthetics.indeterminacyZones || []).map((z, i) => (
                                <li key={i} className="text-sm text-slate-600 flex gap-2">
                                  <span className="text-indigo-500 font-black">•</span> {z}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-xl">
                            <h4 className="font-bold mb-4 text-slate-900">Effets de lecture</h4>
                            <div className="space-y-4">
                              {(dossier.theoretical.receptionAesthetics.readerResponse || []).map((r, i) => (
                                <div key={i} className="space-y-1">
                                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                    <span>{r.effect}</span>
                                    <span>{r.intensity}%</span>
                                  </div>
                                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-full" style={{ width: `${r.intensity}%` }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeLens === 'deconstruction' && (
                      <div className="space-y-6">
                        <div className="bg-slate-900 p-8 rounded-xl text-slate-100 border border-slate-800">
                          <h4 className="font-bold mb-4 text-amber-400">Instabilité du sens</h4>
                          <p className="italic leading-relaxed">"{dossier.theoretical.deconstruction.instabilityOfMeaning}"</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="bg-white p-6 border border-slate-100 rounded-xl shadow-sm">
                              <h4 className="font-bold mb-4 text-slate-900">Paradoxes internes</h4>
                              <div className="space-y-3">
                                {(dossier.theoretical.deconstruction.paradoxes || []).map((p, i) => (
                                  <div key={i} className="p-3 bg-amber-50 border border-amber-100 rounded text-sm italic text-amber-900 leading-tight">
                                    "{p}"
                                  </div>
                                ))}
                              </div>
                           </div>
                           <div className="space-y-4">
                              <h4 className="font-bold text-slate-900 px-1">Hiérarchies Implicitées</h4>
                              {(dossier.theoretical.deconstruction.implicitHierarchies || []).map((h, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                   <div className="flex justify-between items-center font-bold text-slate-800 mb-2">
                                      <span className="text-indigo-600">{h.superior}</span>
                                      <span className="text-xs text-slate-400">/</span>
                                      <span className="text-slate-400 line-through">{h.inferior}</span>
                                   </div>
                                   <p className="text-xs text-slate-500 italic">Subversion: {h.subversion}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Blind Spot Module */}
              <div className="bg-amber-50 p-6 rounded-2xl border-l-4 border-amber-500 flex gap-6 items-start">
                <div className="bg-amber-500 p-3 rounded-full text-white shrink-0">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1 uppercase tracking-wider text-xs">Angle Mort Théorique</h3>
                  <p className="text-amber-800 italic leading-relaxed">
                    {currentLensData?.blindSpot || "Cette grille ne permet pas d'accéder à certaines dimensions irréductibles de l'œuvre."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'comparative':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DivergenceChart data={dossier.comparative?.theoreticalDivergence || []} />
              <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl border border-slate-800 flex flex-col justify-center">
                 <h3 className="text-xl font-bold mb-4 text-indigo-400 flex items-center gap-2">
                    <GitCompare className="w-5 h-5" /> Analyse des Écarts
                 </h3>
                 <p className="text-slate-300 leading-relaxed italic mb-6">
                    "{dossier.comparative?.gapAnalysis}"
                 </p>
                 <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Contexte de l'Auteur</h4>
                    <p className="text-sm text-slate-400">{dossier.comparative?.authorialContext}</p>
                 </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-slate-400" /> Œuvres Contemporaines Associées
               </h3>
               <div className="flex flex-wrap gap-3">
                  {(dossier.comparative?.contemporaries || []).map((work, i) => (
                    <div key={i} className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-slate-700 hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-default">
                       {work}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );

      case 'stylistic':
        const fp = dossier.stylistic?.fingerprint || { complexity: 0, richness: 0, cohesion: 0, abundance: 0, innovation: 0 };
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-1">{dossier.stylistic?.avgSentenceLength || 0}</div>
                <div className="text-slate-500 text-sm font-medium">Longueur Moyenne (mots)</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                <div className="text-4xl font-bold text-amber-600 mb-1">{dossier.stylistic?.metaphorDensity || 0}/10</div>
                <div className="text-slate-500 text-sm font-medium">Densité Métaphorique</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                <div className="flex flex-wrap gap-1 justify-center mt-2">
                  {(dossier.stylistic?.dominantLexicalFields || []).map((f, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{f}</span>
                  ))}
                </div>
                <div className="text-slate-500 text-sm font-medium mt-4">Champs Lexicaux Dominants</div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Empreinte Stylistique Qualitative</h3>
              <RadarComparison data={[
                { subject: 'Complexité', A: fp.complexity },
                { subject: 'Richesse', A: fp.richness },
                { subject: 'Cohésion', A: fp.cohesion },
                { subject: 'Abondance', A: fp.abundance },
                { subject: 'Innovation', A: fp.innovation }
              ]} />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
                {[
                  { label: 'Complexité', val: fp.complexity, desc: 'Richesse syntaxique' },
                  { label: 'Richesse', val: fp.richness, desc: 'Vocabulaire étendu' },
                  { label: 'Cohésion', val: fp.cohesion, desc: 'Logique interne' },
                  { label: 'Abondance', val: fp.abundance, desc: 'Densité textuelle' },
                  { label: 'Innovation', val: fp.innovation, desc: 'Rupture stylistique' }
                ].map((m, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">{m.label}</div>
                    <div className="text-xl font-black text-slate-800">{m.val}%</div>
                    <div className="text-[10px] italic text-slate-500 mt-1">{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'critical':
        return (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-xl border-l-4 border-red-500 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-red-900 flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6" /> Tensions Interprétatives
                </h3>
                <div className="space-y-6">
                  {(dossier.criticalZone?.tensions || []).map((t, i) => (
                    <div key={i} className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <p className="text-red-900 leading-relaxed font-medium">"{t}"</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900 text-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-indigo-400">Lectures Contradictoires</h3>
                <div className="space-y-8">
                  {(dossier.criticalZone?.contradictoryReadings || []).map((reading, i) => (
                    <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-indigo-600">
                      <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-widest mb-2">{reading.theory}</h4>
                      <p className="italic opacity-80 leading-relaxed">"{reading.perspective}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border-2 border-dashed border-slate-300">
               <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                  <EyeOff className="w-6 h-6 text-slate-400" /> Ce que l'œuvre ne permet pas de lire (Silences)
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(dossier.criticalZone?.unreadable || []).map((item, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 italic text-slate-600 leading-relaxed">
                       "{item}"
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-100">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">LiteraGraph</span>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Déconstruction Analytique</p>
        </div>

        <nav className="flex-1 p-6 space-y-1">
          {dossier && NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <div className={activeTab === item.id ? 'text-white' : 'text-indigo-400'}>
                {item.icon}
              </div>
              {item.label}
            </button>
          ))}

          {!dossier && (
            <div className="py-20 text-center px-4">
              <Book className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 text-sm italic font-light">Entrez un titre pour déplier le graphe...</p>
            </div>
          )}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Statut du Graphe</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${dossier ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
              <span className="text-xs font-semibold text-slate-600">
                {dossier ? 'Synchronisation active' : 'Noyau sémantique absent'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <header className="sticky top-0 z-30 glass-morphism px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50">
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
            <form onSubmit={handleSearch} className="relative max-w-xl w-full">
              <input
                type="text"
                placeholder="Ex: Les Misérables, 1984, Lolita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
                className="w-full bg-white/50 border border-slate-200 rounded-full pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-800 disabled:opacity-50 shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <button 
                type="submit" 
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Générer"}
              </button>
            </form>

            <div className="relative group">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-slate-200 rounded-full shadow-sm cursor-pointer hover:bg-slate-100 transition-all">
                <Languages className="w-4 h-4 text-indigo-500" />
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 cursor-pointer appearance-none pr-6"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
              </div>
            </div>
          </div>

          {dossier && (
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0">
              <span>Gemini-3-Pro</span>
              <div className="w-px h-4 bg-slate-200"></div>
              <span>Analytique v2.5</span>
            </div>
          )}
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 text-slate-400">
              <Loader2 className="w-16 h-16 animate-spin mb-6 text-indigo-500" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Dépliement des grilles de lecture...</h2>
              <p className="max-w-md text-center opacity-60">Le modèle extrait les rapports de classe, les tensions pulsionnelles et les invariants narratifs en {selectedLanguage}.</p>
            </div>
          ) : dossier ? (
            renderContent()
          ) : (
            <div className="text-center py-40">
              <div className="serif text-6xl font-bold text-slate-200 mb-8 select-none">L'œuvre est un espace à déplier.</div>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed italic font-light">
                Utilisez l'interface pour déconstruire les textes majeurs selon des protocoles explicites. Aucune lecture n'est naturelle.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
