import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { HealthAnalysis, RiskLevel } from '../types';

interface MindMapProps {
  data: HealthAnalysis;
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("font-family", "sans-serif");

    // Transform flat data into hierarchy
    const rootData = {
      name: "Analysis Overview",
      type: "root",
      children: [
        {
          name: "Symptoms",
          type: "branch",
          children: data.extractedSymptoms.slice(0, 5).map(s => ({ name: s, type: "leaf" }))
        },
        {
          name: "Possibilities",
          type: "branch",
          children: data.conditions.slice(0, 3).map(c => ({ name: c.name, type: "leaf", details: c.likelihood }))
        },
        {
          name: "Risk Level",
          type: "branch",
          children: [{ name: data.riskScore, type: "leaf", details: data.riskExplanation }]
        },
        {
          name: "Actions",
          type: "branch",
          children: data.selfCareSteps.slice(0, 4).map(s => ({ name: s.slice(0, 30) + "...", type: "leaf" }))
        },
        {
          name: "Red Flags",
          type: "branch",
          children: data.redFlags.slice(0, 3).map(f => ({ name: f.slice(0, 30) + "...", type: "leaf", warning: true }))
        }
      ]
    };

    const root = d3.hierarchy(rootData);
    const treeLayout = d3.tree().size([height - 100, width - 200]);
    treeLayout(root);

    const g = svg.append("g")
      .attr("transform", `translate(100, 50)`);

    // Links
    g.selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2)
      .attr("d", d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x) as any);

    // Nodes
    const node = g.selectAll(".node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`);

    // Node Circles
    node.append("circle")
      .attr("r", 6)
      .attr("fill", (d: any) => {
        if (d.data.warning) return "#ef4444"; // Red
        if (d.data.type === 'root') return "#3b82f6"; // Blue
        if (d.data.type === 'branch') return "#64748b"; // Gray
        return "#10b981"; // Green
      });

    // Node Labels
    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: any) => d.children ? -10 : 10)
      .attr("text-anchor", (d: any) => d.children ? "end" : "start")
      .text((d: any) => d.data.name)
      .clone(true).lower()
      .attr("stroke", "white")
      .attr("stroke-width", 3);

  }, [data]);

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-sm font-semibold text-slate-600">
            Concept Map
        </div>
      <svg ref={svgRef} className="w-full h-[400px] md:h-[600px]"></svg>
    </div>
  );
};

export default MindMap;
