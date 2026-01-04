
import React, { useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  Legend, AreaChart, Area
} from 'recharts';
import * as d3 from 'd3';
import { Character, Relationship, Theme, ComparativeMetric, ThemeEvolution } from '../types';

const CHARACTER_ICONS: Record<string, string> = {
  hero: '⭐',
  villain: '⚔️',
  mentor: '📖',
  ally: '🛡️',
  sidekick: '👥',
};

const RELATIONSHIP_COLORS: Record<string, string> = {
  conflict: '#ef4444',
  love: '#ec4899',
  kinship: '#10b981',
  mentor: '#f59e0b',
  neutral: '#64748b',
};

export const ThemeEvolutionChart: React.FC<{ data: ThemeEvolution[] }> = ({ data }) => {
  // Sécurité : Vérifier que data est un tableau non vide et que le premier élément a une progression
  if (!data || !Array.isArray(data) || data.length === 0 || !data[0]?.progression) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-[400px] flex items-center justify-center text-slate-400 italic">
        Données d'évolution thématique indisponibles
      </div>
    );
  }

  try {
    const stages = data[0].progression.map(p => p.stage);
    const chartData = stages.map(stage => {
      const entry: any = { stage };
      data.forEach(theme => {
        const point = theme.progression?.find(p => p.stage === stage);
        entry[theme.theme] = point ? point.intensity : 0;
      });
      return entry;
    });

    const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-[400px]">
        <h3 className="text-lg font-bold mb-6 text-slate-800">Évolution Temporelle des Thèmes</h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            {data.map((theme, i) => (
              <Area 
                key={theme.theme}
                type="monotone" 
                dataKey={theme.theme} 
                stroke={colors[i % colors.length]} 
                fill={colors[i % colors.length]} 
                fillOpacity={0.15} 
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  } catch (e) {
    console.error("Error rendering ThemeEvolutionChart:", e);
    return <div className="p-6 text-red-500">Erreur de rendu du graphique d'évolution.</div>;
  }
};

export const DivergenceChart: React.FC<{ data: ComparativeMetric[] }> = ({ data }) => {
  if (!data || !Array.isArray(data)) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-[400px]">
      <h3 className="text-lg font-bold mb-6 text-slate-800">Visualisation par écart (Divergence)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="subject" type="category" width={100} tick={{ fontSize: 11 }} />
          <Tooltip cursor={{ fill: '#f1f5f9' }} />
          <Legend />
          <Bar name="Cette Œuvre" dataKey="workValue" fill="#6366f1" radius={[0, 4, 4, 0]} />
          <Bar name="Médiane Corpus" dataKey="corpusValue" fill="#cbd5e1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CharacterGraph: React.FC<{ characters: Character[], relationships: Relationship[] }> = ({ characters, relationships }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !characters || characters.length === 0) return;

    const width = 800;
    const height = 500;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodes = characters.map(c => ({ ...c, id: c.name }));
    const nodeIds = new Set(nodes.map(n => n.id));

    const links = (relationships || [])
      .filter(r => nodeIds.has(r.source) && nodeIds.has(r.target))
      .map(r => ({ ...r }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150).strength(0.4))
      .force("charge", d3.forceManyBody().strength(-600))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => RELATIONSHIP_COLORS[d.type] || '#cbd5e1')
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.max(1.5, (d.strength || 1) * 0.8))
      .attr("stroke-dasharray", (d: any) => (d.type === 'conflict' || d.type === 'mentor' ? "4,4" : "0"));

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", 22)
      .attr("fill", "#fff")
      .attr("stroke", (d: any) => {
        if (d.iconType === 'hero') return '#6366f1';
        if (d.iconType === 'villain') return '#ef4444';
        return '#cbd5e1';
      })
      .attr("stroke-width", 2);

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", "18px")
      .text((d: any) => CHARACTER_ICONS[d.iconType] || '👤');

    node.append("text")
      .attr("x", 0)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .text(d => d.name)
      .attr("class", "text-[11px] font-bold")
      .style("fill", "#334155");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [characters, relationships]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-[650px]">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-slate-800">Graphe Relationnel Dynamique</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
           <div className="space-y-1">
             <p className="mb-2 border-b border-slate-100 pb-1">Icônes</p>
             <div className="flex items-center gap-2"><span className="text-sm">⭐</span> Héros</div>
             <div className="flex items-center gap-2"><span className="text-sm">⚔️</span> Antagoniste</div>
             <div className="flex items-center gap-2"><span className="text-sm">📖</span> Mentor</div>
             <div className="flex items-center gap-2"><span className="text-sm">🛡️</span> Allié</div>
           </div>
           <div className="space-y-1">
             <p className="mb-2 border-b border-slate-100 pb-1">Relations</p>
             <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-[#ef4444] border-t border-dashed"></div> Conflit</div>
             <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-[#ec4899]"></div> Romance</div>
             <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-[#10b981]"></div> Parenté</div>
             <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-[#f59e0b] border-t border-dashed"></div> Tutorat</div>
           </div>
        </div>
      </div>
      <div className="flex-1 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative">
        <svg ref={svgRef} width="100%" height="100%" className="cursor-move" viewBox="0 0 800 500" />
      </div>
      <p className="mt-4 text-xs text-slate-400 italic">Épaisseur = Intensité • Pointillés = Tension ou tutorat</p>
    </div>
  );
};

export const ThemeCloud: React.FC<{ themes: Theme[] }> = ({ themes }) => {
  if (!themes || !Array.isArray(themes) || themes.length === 0) return null;
  const maxWeight = Math.max(...themes.map(t => t.weight || 0), 1);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-full overflow-y-auto">
      <h3 className="text-lg font-bold mb-6 text-slate-800">Pondération des Thèmes</h3>
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {themes.map((t, idx) => {
          const relativeWeight = (t.weight / maxWeight);
          const fontSize = 0.8 + (relativeWeight * 1.5); 
          return (
            <span 
              key={idx} 
              title={t.description}
              className="px-4 py-2 rounded-xl border border-slate-100 shadow-sm font-semibold text-slate-700 transition-all hover:scale-110 hover:bg-indigo-50 hover:text-indigo-700 cursor-help"
              style={{ 
                fontSize: `${fontSize}rem`, 
                opacity: 0.4 + (relativeWeight * 0.6) 
              }}
            >
              {t.label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const RadarComparison: React.FC<{ data: any[] }> = ({ data }) => {
  if (!data || !Array.isArray(data)) return null;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Analyse" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export const Heatmap: React.FC<{ data: any[] }> = ({ data }) => {
  if (!data || !Array.isArray(data)) {
    return <div className="p-10 text-center text-slate-400 italic">Données de corrélation indisponibles.</div>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {data.map((item, i) => (
        <div 
          key={i} 
          className="aspect-square flex flex-col items-center justify-center p-3 rounded-xl text-[11px] text-center shadow-sm border border-slate-50 transition-transform hover:scale-105"
          style={{ backgroundColor: `rgba(99, 102, 241, ${Math.max(0.1, (item.intensity || 0) / 100)})`, color: (item.intensity || 0) > 50 ? 'white' : '#1e293b' }}
        >
          <div className="font-bold mb-2 break-words w-full leading-tight uppercase tracking-tighter">{item.theme}</div>
          <div className="truncate w-full opacity-90 italic">{item.character}</div>
          <div className="mt-2 text-[10px] font-black">{item.intensity || 0}%</div>
        </div>
      ))}
    </div>
  );
};
