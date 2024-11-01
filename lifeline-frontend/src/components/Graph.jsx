import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ZoomIn, ZoomOut, RefreshCw, Info, Link2 } from "lucide-react";

const Graph = ({ users, relationships, onNodeClick }) => {
  const svgRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (users.length > 0) {
      const cleanup = createGraph(users, relationships);
      return cleanup;
    }
  }, [users, relationships]);

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

    // Color palette for relationships
    const relationshipColors = {
      friend: "#4CAF50",
      colleague: "#2196F3",
      family: "#FF5722",
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
      .force("collision", d3.forceCollide().radius(80))
      .on("tick", ticked);

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

  const resetGraph = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).selectAll("*").remove();
      createGraph(users, relationships);
    }
  };

  return (
    <div className="relative bg-gray-100 rounded-lg shadow-lg p-4">
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <button
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
          onClick={() => {
            const currentZoom = zoomLevel;
            d3.select(svgRef.current).call(
              d3.zoom().transform,
              d3.zoomIdentity.scale(Math.min(currentZoom + 0.2, 5))
            );
          }}
        >
          <ZoomIn size={20} />
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
          onClick={() => {
            const currentZoom = zoomLevel;
            d3.select(svgRef.current).call(
              d3.zoom().transform,
              d3.zoomIdentity.scale(Math.max(currentZoom - 0.2, 0.5))
            );
          }}
        >
          <ZoomOut size={20} />
        </button>
        <button
          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
          onClick={resetGraph}
        >
          <RefreshCw size={20} />
        </button>
      </div>
      <div
        id="tooltip"
        className="absolute opacity-0 bg-white text-black border rounded shadow-lg p-3 pointer-events-none max-w-xs"
      ></div>
      <div ref={svgRef} className="mt-4 w-full h-[80vh]"></div>
    </div>
  );
};

export default Graph;
