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
// Default node configuration for fallback
const DEFAULT_NODE_CONFIG = {
  gradient: {
    startColor: "#E5E7EB",
    endColor: "#9CA3AF",
  },
  strokeColor: "#6B7280",
  radius: (d) => 35,
  hoverColor: "#4B5563",
};

const Graph = ({
  users,
  groups,
  events,
  relatesTo,
  memberOf,
  onNodeClick,
  title,
  description,
}) => {
  const svgRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [legendVisible, setLegendVisible] = useState(true);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState(null);

  const getNodeConfig = (type, edges) => {
    console.log("d.type", type);
    // Use our default config object defined above
    // if (!type || !DEFAULT_NODE_CONFIG[type]) {
    //   console.warn(
    //     `No configuration found for node type: ${type}, using default config`
    //   );
    //   return DEFAULT_NODE_CONFIG.default;
    // }
    console.log("nodeConfig[type]: ", nodeConfig(edges)[type]);
    return nodeConfig(edges)[type];
  };

  const createGraph = () => {
    console.log("Creating graph with data:", {
      users,
      groups,
      events,
      relatesTo,
      memberOf,
    });

    const width = window.innerWidth * 0.9;
    const height = window.innerHeight * 0.8;

    // Clear existing SVG
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    console.log("Created SVG element:", svg.node());

    // Add zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        svgContainer.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    const svgContainer = svg.append("g");
    console.log("Created SVG container:", svgContainer.node());

    createGradientDefs(svg, nodeConfig);

    // Prepare graph data with validation and logging
    const { nodes, edges } = prepareGraphData(
      users,
      groups,
      events,
      relatesTo,
      memberOf
    );

    console.log("Prepared graph data:", { nodes, edges });

    // Validate nodes
    const validNodes = nodes.filter((node) => {
      if (!node.type) {
        console.warn(`Node missing type:`, node);
        return false;
      }
      return true;
    });

    console.log("Valid nodes:", validNodes);

    const simulation = d3
      .forceSimulation(validNodes)
      .force("link", d3.forceLink(edges).distance(200))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(80));

    console.log("Created simulation:", simulation);

    // Create edges with logging
    const link = svgContainer
      .append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(edges)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("stroke", (d) => {
        if (d.type === "RELATES_TO") {
          return (
            relatesToConfig[d.relatesTo]?.color || relatesToConfig.default.color
          );
        } else if (d.type === "MEMBER_OF") {
          return "#3F51B5";
        }
        return "#E5E7EB"; // Default color
      })
      .attr("stroke-width", (d) => Math.sqrt((d.level || 100) / 5))
      .attr("stroke-opacity", 0.6)
      .attr("fill", "none")
      .attr("marker-mid", "url(#arrow)");

    console.log("Created links:", link.nodes().length);

    const dragHandlers = createDragHandlers(
      simulation,
      width,
      height,
      isLocked
    );

    // Create nodes with logging
    const nodeGroups = svgContainer
      .append("g")
      .attr("class", "nodes")
      .selectAll(".node-group")
      .data(validNodes)
      .enter()
      .append("g")
      .attr("class", "node-group");

    console.log("Created node groups:", nodeGroups.nodes().length);

    // Add drag behavior
    nodeGroups.call(
      d3
        .drag()
        .on("start", dragHandlers.dragStarted)
        .on("drag", dragHandlers.dragged)
        .on("end", dragHandlers.dragEnded)
    );

    // Add circles
    const circles = nodeGroups
      .append("circle")
      .attr("r", (d) => {
        const config = getNodeConfig(d.type, edges);
        console.log("Node radius for type:", d.type, config.radius(d));
        return config.radius(d);
      })
      .attr("fill", (d) => `url(#gradient-${d.type || "default"})`)
      .attr("stroke", (d) => getNodeConfig(d.type, edges).strokeColor)
      .attr("stroke-width", 2)
      .attr("filter", "url(#drop-shadow)")
      .attr("class", "transition-all duration-200 ease-in-out");

    console.log("Created circles:", circles.nodes().length);

    // Add icons
    nodeGroups
      .append("path")
      .attr("d", (d) => getNodeConfig(d.type, edges).icon)
      .attr("fill", "white")
      .attr("transform", "translate(-12, -12) scale(1)")
      .attr("class", "pointer-events-none");

    // Add labels
    nodeGroups
      .append("text")
      .attr("dy", (d) => getNodeConfig(d.type, edges).labelOffset)
      .attr("text-anchor", "middle")
      .attr("class", "text-sm font-medium pointer-events-none")
      .attr("fill", "#1F2937")
      .text((d) => d.name || "Unnamed")
      .each(function (d) {
        const text = d3.select(this);
        const words = (d.name || "Unnamed").split(/\s+/);
        if (words.length > 2) {
          text.text(words.slice(0, 2).join(" ") + "...");
        }
      });

    // Add simulation tick handler
    if (!isLocked) {
      simulation.on("tick", () => {
        link.attr("d", (d) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dr = Math.sqrt(dx * dx + dy * dy);
          return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        });

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

  useEffect(() => {
    console.log("useEffect triggered");
    if (svgRef.current) {
      createGraph();
    }
  }, [users, groups, events, relatesTo, memberOf, isLocked]);

  const handleNodeMouseOver = (event, d) => {
    d3.select(event.currentTarget)
      .select("circle")
      .transition()
      .duration(200)
      .attr("stroke-width", 4)
      .attr("filter", "url(#drop-shadow)");

    const connections = relatesTo.filter(
      (rel) => rel.a.properties.id === d.id || rel.b.properties.id === d.id
    );

    d3.select("#node-info-title").text(d.name || "Node Info");
    d3.select("#node-info-content").html(`
      <div class="mb-1">Type: ${
        d.type.charAt(0).toUpperCase() + d.type.slice(1)
      }</div>
      <div class="mb-1">Connections: ${connections.length}</div>
      ${Object.entries(d.metadata || {})
        .map(([key, value]) => `<div class="mb-1">${key}: ${value}</div>`)
        .join("")}
    `);
    setSelectedNodeInfo({
      name: d.name,
      type: d.type.charAt(0).toUpperCase() + d.type.slice(1),
      connections: connections.length,
      metadata: d.metadata || {},
    });
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
        {/* Fixed Node Info Panel */}
        <div
          id="node-info"
          className="absolute right-4 top-4 bg-white/95 backdrop-blur-sm text-gray-900 border border-gray-100 rounded-xl shadow-lg p-4 pointer-events-none max-w-xs z-20 transition-all duration-200"
        >
          {selectedNodeInfo ? (
            <>
              <p className="font-semibold text-lg">{selectedNodeInfo.name}</p>
              <p className="text-sm text-gray-500">
                Type: {selectedNodeInfo.type}
              </p>
              <p className="text-sm text-gray-500">
                Connections: {selectedNodeInfo.connections}
              </p>
              {selectedNodeInfo.metadata &&
                Object.entries(selectedNodeInfo.metadata).map(
                  ([key, value]) => (
                    <p key={key} className="text-sm text-gray-500">
                      {key}: {value}
                    </p>
                  )
                )}
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Hover over a node to see details
            </p>
          )}
        </div>
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
