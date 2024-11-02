// components/Graph.jsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { nodeConfig } from "../../lib/config/nodesConfig";
import { relatesToConfig } from "../../lib/config/relationshipsConfig";
import {
  createGradientDefs,
  createDragHandlers,
  prepareGraphData,
} from "../../lib/utils/graphUtils";
import { GraphLegend } from "./GraphLegend.jsx";
import { GraphControls } from "./GraphControls";
import { GraphStats } from "./GraphStats";

const Graph = ({
  users,
  groups,
  events,
  relatesTo,
  onNodeClick,
  title,
  description,
}) => {
  const svgRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [legendVisible, setLegendVisible] = useState(true);

  useEffect(() => {
    if (users.length > 0 || groups.length > 0 || events.length > 0) {
      const cleanup = createGraph();
      return cleanup;
    }
  }, [users, groups, events, relatesTo, isLocked]);

  const createGraph = () => {
    const width = window.innerWidth * 0.9;
    const height = window.innerHeight * 0.8;

    // Clear previous SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG with zoom capability
    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(
        d3
          .zoom()
          .scaleExtent([0.5, 5])
          .on("zoom", (event) => {
            svgContainer.attr("transform", event.transform);
            setZoomLevel(event.transform.k);
          })
      );

    const svgContainer = svg.append("g");
    createGradientDefs(svg, nodeConfig);

    const { nodes, edges } = prepareGraphData(users, groups, events, relatesTo);

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(edges).distance(200))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(80));

    // Add links
    const link = svgContainer
      .append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(edges)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "stroke",
        (d) =>
          relatesToConfig[d.relatesTo]?.color || relatesToConfig.default.color
      )
      .attr("stroke-width", (d) => Math.sqrt(d.level / 5))
      .attr("stroke-opacity", 0.6)
      .attr("fill", "none")
      // components/Graph.jsx (continued)
      .attr("marker-mid", "url(#arrow)");

    const dragHandlers = createDragHandlers(
      simulation,
      width,
      height,
      isLocked
    );
    // Create node groups
    const nodeGroups = svgContainer
      .append("g")
      .attr("class", "nodes")
      .selectAll(".node-group")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node-group")
      .call(
        d3
          .drag()
          .on("start", dragHandlers.dragStarted)
          .on("drag", dragHandlers.dragged)
          .on("end", dragHandlers.dragEnded)
      );

    // Add node circles with gradients
    nodeGroups
      .append("circle")
      .attr("r", (d) => {
        const connectionCount = edges.filter(
          (e) => e.source.id === d.id || e.target.id === d.id
        ).length;
        return Math.max(30, Math.min(50, 20 + connectionCount * 3));
      })
      .attr("fill", (d) => `url(#gradient-${d.type})`)
      .attr("stroke", (d) => nodeConfig[d.type].hoverColor)
      .attr("stroke-width", 2)
      .attr("filter", "url(#drop-shadow)");

    // Add node labels
    nodeGroups
      .append("text")
      .attr("dy", 40)
      .attr("text-anchor", "middle")
      .attr("class", "text-sm font-medium")
      .attr("fill", "#374151")
      .text((d) => d.name);

    // Add hover effects and tooltips
    nodeGroups
      .on("mouseover", handleNodeMouseOver)
      .on("mouseout", handleNodeMouseOut)
      .on("click", (event, d) => onNodeClick && onNodeClick(d));

    if (!isLocked) {
      simulation.on("tick", () => {
        // Update link positions with curved paths
        link.attr("d", (d) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dr = Math.sqrt(dx * dx + dy * dy);
          return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        });

        // Update node positions
        nodeGroups.attr("transform", (d) => {
          d.x = Math.max(60, Math.min(width - 60, d.x));
          d.y = Math.max(60, Math.min(height - 60, d.y));
          return `translate(${d.x},${d.y})`;
        });
      });
    } else {
      simulation.stop();
    }

    return () => {
      simulation.stop();
    };
  };

  const handleNodeMouseOver = (event, d) => {
    // Highlight node
    d3.select(event.currentTarget)
      .select("circle")
      .transition()
      .duration(200)
      .attr("stroke-width", 4)
      .attr("filter", "url(#drop-shadow)");

    // Show tooltip
    const tooltip = d3.select("#tooltip");
    tooltip.transition().duration(200).style("opacity", 1);

    const connections = relatesTo.filter(
      (rel) => rel.a.properties.id === d.id || rel.b.properties.id === d.id
    );

    tooltip
      .html(
        `
        <div class="font-semibold text-lg mb-2">${d.name}</div>
        <div class="text-sm">
          <div class="mb-1">Type: ${
            d.type.charAt(0).toUpperCase() + d.type.slice(1)
          }</div>
          <div class="mb-1">Connections: ${connections.length}</div>
          ${Object.entries(d.metadata || {})
            .map(([key, value]) => `<div class="mb-1">${key}: ${value}</div>`)
            .join("")}
        </div>
      `
      )
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY - 10}px`);
  };

  const handleNodeMouseOut = (event) => {
    d3.select(event.currentTarget)
      .select("circle")
      .transition()
      .duration(200)
      .attr("stroke-width", 2);

    d3.select("#tooltip").transition().duration(200).style("opacity", 0);
  };

  const handleZoom = (delta) => {
    const newZoom = Math.max(0.5, Math.min(5, zoomLevel + delta));
    d3.select(svgRef.current)
      .select("svg")
      .transition()
      .duration(300)
      .call(d3.zoom().transform, d3.zoomIdentity.scale(newZoom));
    setZoomLevel(newZoom);
  };

  return (
    <Card className="w-full h-full bg-white shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="space-y-1 bg-gray-50/30 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title || "Network Graph"}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm text-gray-600">
                {description}
              </CardDescription>
            )}
          </div>
          <GraphControls
            handleZoom={handleZoom}
            isLocked={isLocked}
            setIsLocked={setIsLocked}
            resetGraph={() => {
              setZoomLevel(1);
              createGraph();
            }}
            toggleLegend={() => setLegendVisible(!legendVisible)}
          />
        </div>
      </CardHeader>

      <CardContent className="relative p-0">
        {legendVisible && (
          <GraphLegend
            nodeConfig={nodeConfig}
            relatesToConfig={relatesToConfig}
          />
        )}

        {/* Tooltip */}
        <div
          id="tooltip"
          className="absolute opacity-0 bg-white/95 backdrop-blur-sm text-gray-900 border border-gray-100 rounded-xl shadow-lg p-4 pointer-events-none max-w-xs z-20 transition-all duration-200"
        />

        {/* Graph Container */}
        <div
          ref={svgRef}
          className="w-full h-[calc(100vh-12rem)] bg-gradient-to-br from-gray-50/50 to-white/30"
        />

        <GraphStats
          users={users}
          groups={groups}
          events={events}
          relatesTo={relatesTo}
          zoomLevel={zoomLevel}
        />
      </CardContent>
    </Card>
  );
};

export default Graph;
