import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type{ GeoData } from '../types';

interface WorldMapProps {
  markers: GeoData[];
  width?: number;
  height?: number;
  hideOverlay?: boolean;
}

// Simplified world geojson geometry
const GEOJSON_URL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

export const WorldMap: React.FC<WorldMapProps> = ({ markers, width, height, hideOverlay = false }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [geoJson, setGeoJson] = useState<any>(null);
  const [popup, setPopup] = useState<{ x: number, y: number, data: GeoData } | null>(null);

  // Load GeoJSON once
  useEffect(() => {
    d3.json(GEOJSON_URL).then((data) => {
        setGeoJson(data);
    });
  }, []);

  useEffect(() => {
    if (!geoJson || !containerRef.current || !svgRef.current) return;

    const w = width || containerRef.current.clientWidth || 800;
    const h = height || containerRef.current.clientHeight || 400;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Add clipPath to svg definition to prevent lines from drawing outside the map area
    const defs = svg.append("defs");
    defs.append("clipPath")
        .attr("id", "map-clip")
        .append("rect")
        .attr("width", w)
        .attr("height", h);

    // Create a group for map content that will be zoomed
    // Apply clip-path to this group
    const mapGroup = svg.append("g")
        .attr("clip-path", "url(#map-clip)");

    // Projection
    const projection = d3.geoMercator()
      .scale(w / 6.5)
      .center([0, 20])
      .translate([w / 2, h / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8]) // Min 1x, Max 8x zoom
      .translateExtent([[0, 0], [w, h]]) // Limit pan to size of SVG
      .on("zoom", (event) => {
        mapGroup.attr("transform", event.transform);
        setPopup(null); // Hide popup while zooming/panning
      });

    // Apply zoom to SVG background
    svg.call(zoom as any);

    // Draw Map Paths (Countries)
    mapGroup.append("g")
      .selectAll("path")
      .data(geoJson.features)
      .enter()
      .append("path")
      .attr("fill", "#1e293b") // slate-800
      .attr("d", pathGenerator as any)
      .attr("stroke", "#334155") // slate-700
      .attr("stroke-width", 0.5)
      .style("cursor", "grab");

    // Draw Connecting Lines (for traceroute)
    if (markers.length > 1) {
        const linkData = [];
        for (let i = 0; i < markers.length - 1; i++) {
            const source = markers[i];
            const target = markers[i+1];
            if (source.latitude && source.longitude && target.latitude && target.longitude) {
                 linkData.push({ 
                     type: "LineString", 
                     coordinates: [[source.longitude, source.latitude], [target.longitude, target.latitude]] 
                 });
            }
        }
        
        const lines = mapGroup.append("g")
            .selectAll("path")
            .data(linkData)
            .enter()
            .append("path")
            .attr("d", (d) => pathGenerator(d as any))
            .attr("fill", "none")
            .attr("stroke", "#06b6d4") // cyan-500
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 0.8)
            .attr("stroke-linecap", "round");

        // Animate Line Drawing
        lines.each(function() {
            const length = (this as SVGPathElement).getTotalLength();
            if (length > 0) {
                d3.select(this)
                    .attr("stroke-dasharray", length + " " + length)
                    .attr("stroke-dashoffset", length)
                    .transition()
                    .duration(1500)
                    .ease(d3.easeCubicOut)
                    .attr("stroke-dashoffset", 0);
            }
        });
    }

    // Draw Markers
    const validMarkers = markers.filter(m => m.latitude && m.longitude);

    const nodes = mapGroup.append("g")
      .selectAll("circle")
      .data(validMarkers)
      .enter()
      .append("circle")
      .attr("cx", (d) => projection([d.longitude, d.latitude])![0])
      .attr("cy", (d) => projection([d.longitude, d.latitude])![1])
      .attr("r", 0) // Start at 0 for entry animation
      .attr("fill", "#22d3ee") // cyan-400
      .attr("stroke", "#0891b2")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      // Hover Interactions
      .on("mouseover", (event, d) => {
          // Highlight circle
          d3.select(event.currentTarget)
            .transition().duration(200)
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .attr("r", 8)
            .attr("fill", "#67e8f9"); // brighter cyan

          // Show popup
          // Use d3.pointer relative to the container for correct positioning even when zoomed
          const [x, y] = d3.pointer(event, containerRef.current);
          setPopup({ x, y, data: d });
      })
      .on("mouseout", (event) => {
          // Reset circle
          d3.select(event.currentTarget)
            .transition().duration(300)
            .attr("stroke", "#0891b2")
            .attr("stroke-width", 1)
            .attr("r", 5)
            .attr("fill", "#22d3ee");
          
          // Hide popup
          setPopup(null);
      });
      
    // Animate Markers Entry (Staggered)
    nodes.transition()
      .delay((_d, i) => i * 300) 
      .duration(500)
      .ease(d3.easeBackOut)
      .attr("r", 5);
  

    // Add pulsing effect for the last marker (active target)
    if (validMarkers.length > 0) {
        const last = validMarkers[validMarkers.length - 1];
        const proj = projection([last.longitude, last.latitude]);
        if (proj) {
            const [x, y] = proj;
            
            const pulse = mapGroup.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 5)
                .attr("fill", "none")
                .attr("stroke", "#22d3ee")
                .attr("stroke-width", 2);

            function repeat() {
                pulse
                    .transition()
                    .duration(2000)
                    .attr("r", 25)
                    .style("opacity", 0)
                    .on("end", function() {
                        d3.select(this).attr("r", 5).style("opacity", 1);
                        repeat();
                    });
            }
            repeat();
        }
    }

  }, [geoJson, markers, width, height]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-slate-900 overflow-hidden group">
      {!hideOverlay && (
          <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur border border-slate-700 p-2 rounded shadow text-xs pointer-events-none select-none">
              <span className="text-cyan-400 font-bold"><i className="fas fa-globe mr-1"></i> Live Threat Map</span>
              <span className="block text-[10px] text-slate-500 mt-1">Scroll to Zoom • Drag to Pan</span>
          </div>
      )}
      
      {/* Interactive Tooltip (Hover Based) */}
      {popup && (
        <div 
            className="absolute z-20 bg-slate-800/90 backdrop-blur-md border border-cyan-500/30 p-2.5 rounded-lg shadow-2xl text-xs pointer-events-none transition-opacity duration-200"
            style={{ 
                left: popup.x, 
                top: popup.y - 15, 
                transform: 'translate(-50%, -100%)',
                minWidth: '160px'
            }}
        >
            <div className="flex items-center space-x-2 mb-1.5 pb-1.5 border-b border-slate-700/50">
                <i className="fas fa-server text-cyan-400"></i>
                <span className="font-bold text-slate-200">{popup.data.ip}</span>
                {popup.data.flag && <span className="ml-auto text-sm">{popup.data.flag?.emoji}
</span>}
            </div>
            <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                    <span className="text-slate-500">City:</span>
                    <span>{popup.data.city || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Country:</span>
                    <span>{popup.data.country_code || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">ISP:</span>
                    <span className="truncate max-w-[100px] text-right" title={popup.data.isp}>{popup.data.isp || 'N/A'}</span>
                </div>
            </div>
            <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-800 border-r border-b border-cyan-500/30 rotate-45"></div>
        </div>
      )}
      
      <svg ref={svgRef} width={width || "100%"} height={height || "100%"} className="block w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};