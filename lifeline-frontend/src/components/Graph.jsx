import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ZoomIn, ZoomOut, RefreshCw, Info, Lock, Unlock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  // Relationship types and their colors
  const relationshipConfig = {
    Friend: { color: "#4CAF50", icon: "👥" },
    Colleague: { color: "#2196F3", icon: "💼" },
    Family: { color: "#FF5722", icon: "❤️" },
    default: { color: "#9E9E9E", icon: "🔗" },
  };

  useEffect(() => {
    if (users.length > 0) {
      const cleanup = createGraph(users, relatesTo);
      return cleanup;
    }
  }, [users, relatesTo, isLocked]);

  const createGraph = (userData, relationshipData) => {
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

    // Color palette for relatesTo
    const relationshipColors = {
      Friend: "#4CAF50",
      Colleague: "#2196F3",
      Family: "#FF5722",
      default: "#9E9E9E",
    };

    // Create nodes with initial positions
    const nodes = userData.map((user, index) => ({
      id: user.id,
      name: user.name,
      x: (width / (userData.length + 1)) * (index + 1),
      y: height / 2,
      metadata: user.metadata || {},
    }));

    // Create edges from relationship data
    const edges = relationshipData.map((rel) => ({
      source: nodes.find((node) => node.id === rel.a.properties.id),
      target: nodes.find((node) => node.id === rel.b.properties.id),
      relationship: rel.r.properties.relationship,
      level: rel.r.properties.level,
    }));

    // Create the links (edges)
    const links = svgContainer
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("g");

    // Add the actual lines for the edges
    links
      .append("line")
      .attr("class", "link")
      .attr(
        "stroke",
        (d) => relationshipColors[d.relationship] || relationshipColors.default
      )
      .attr("stroke-width", (d) => Math.sqrt(d.level / 10))
      .attr("stroke-opacity", 0.6)
      .attr("marker-mid", "url(#arrow)");

    // Add a marker for edge directionality
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#666");

    // Add labels to the edges
    links
      .append("text")
      .attr("class", "link-label")
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .attr("font-size", "10px")
      .text((d) => `${d.relationship} (${d.level}%)`);

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(edges).distance(200))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(80));

    if (!isLocked) {
      simulation.on("tick", ticked);
    } else {
      simulation.stop();
    }

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
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded)
      );

    // Add nodes as colored circles with size based on connections
    nodeGroups
      .append("circle")
      .attr("r", (d) =>
        Math.max(
          20,
          Math.min(
            50,
            10 +
              edges.filter((e) => e.source.id === d.id || e.target.id === d.id)
                .length *
                5
          )
        )
      )
      .attr("fill", "#3498db")
      .attr("stroke", "#2980b9")
      .attr("stroke-width", 3);

    // Add node labels
    nodeGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("font-size", "12px")
      .attr("fill", "white")
      .text((d) => d.name);

    // Add tooltips
    nodeGroups
      .on("mouseover", function (event, d) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", (d) =>
            Math.max(
              20,
              Math.min(
                50,
                10 +
                  edges.filter(
                    (e) => e.source.id === d.id || e.target.id === d.id
                  ).length *
                    5 +
                  10
              )
            )
          );

        const tooltip = d3.select("#tooltip");
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `
            <strong>${d.name}</strong>
            ${Object.entries(d.metadata)
              .map(([key, value]) => `<br>${key}: ${value}`)
              .join("")}
          `
          )
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function () {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", (d) =>
            Math.max(
              20,
              Math.min(
                50,
                10 +
                  edges.filter(
                    (e) => e.source.id === d.id || e.target.id === d.id
                  ).length *
                    5
              )
            )
          );

        d3.select("#tooltip").transition().duration(500).style("opacity", 0);
      })
      .on("click", (event, d) => onNodeClick && onNodeClick(d));

    // Update positions on simulation tick
    function ticked() {
      // Update edge positions
      links
        .selectAll("line")
        .attr("x1", (d) => Math.max(60, Math.min(width - 60, d.source.x)))
        .attr("y1", (d) => Math.max(60, Math.min(height - 60, d.source.y)))
        .attr("x2", (d) => Math.max(60, Math.min(width - 60, d.target.x)))
        .attr("y2", (d) => Math.max(60, Math.min(height - 60, d.target.y)));

      // Update edge label positions
      links
        .selectAll("text")
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2);

      // Update node positions
      nodeGroups.attr("transform", (d) => {
        d.x = Math.max(60, Math.min(width - 60, d.x));
        d.y = Math.max(60, Math.min(height - 60, d.y));
        return `translate(${d.x}, ${d.y})`;
      });
    }

    // Drag handlers
    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = Math.max(60, Math.min(width - 60, event.x));
      d.fy = Math.max(60, Math.min(height - 60, event.y));
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  };

  // const resetGraph = () => {
  //   if (svgRef.current) {
  //     d3.select(svgRef.current).selectAll("*").remove();
  //     createGraph(users, relatesTo);
  //   }
  // };

  const handleZoom = (delta) => {
    const newZoom = Math.max(0.5, Math.min(5, zoomLevel + delta));
    d3.select(svgRef.current).call(
      d3.zoom().transform,
      d3.zoomIdentity.scale(newZoom)
    );
    setZoomLevel(newZoom);
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">
              {title || "Network Graph"}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm text-gray-500">
                {description}
              </CardDescription>
            )}
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition"
                    onClick={() => handleZoom(0.2)}
                  >
                    <ZoomIn size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Zoom In</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition"
                    onClick={() => handleZoom(-0.2)}
                  >
                    <ZoomOut size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Zoom Out</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition"
                    onClick={() => setIsLocked(!isLocked)}
                  >
                    {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {isLocked ? "Unlock Graph" : "Lock Graph"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition"
                    onClick={() => {
                      setZoomLevel(1);
                      createGraph(users, relatesTo);
                    }}
                  >
                    <RefreshCw size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Reset Graph</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="bg-purple-100 text-purple-600 p-2 rounded-lg hover:bg-purple-200 transition"
                    onClick={() => setLegendVisible(!legendVisible)}
                  >
                    <Info size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Toggle Legend</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative p-0">
        {/* Legend */}
        {legendVisible && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-10">
            <h3 className="font-semibold mb-2">Relationship Types</h3>
            <div className="space-y-2">
              {Object.entries(relationshipConfig).map(
                ([type, { color, icon }]) => (
                  <div key={type} className="flex items-center space-x-2">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span>{icon}</span>
                    <span>{type}</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Tooltip */}
        <div
          id="tooltip"
          className="absolute opacity-0 bg-white/90 backdrop-blur-sm text-black border rounded-lg shadow-lg p-4 pointer-events-none max-w-xs z-20"
        />

        {/* Graph */}
        <div
          ref={svgRef}
          className="w-full h-[calc(100vh-12rem)] bg-gray-50/50"
        />
      </CardContent>
    </Card>
  );
};

export default Graph;
