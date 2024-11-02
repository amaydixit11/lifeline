// utils/graphUtils.js
export const createGradientDefs = (svg, nodeConfig) => {
  const defs = svg.append("defs");

  // Create gradient definitions for nodes
  Object.entries(nodeConfig).forEach(([type, config]) => {
    const gradient = defs
      .append("radialGradient")
      .attr("id", `gradient-${type}`)
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", config.color)
      .attr("stop-opacity", 0.8);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", config.hoverColor)
      .attr("stop-opacity", 1);
  });

  // Add drop shadow filter
  defs
    .append("filter")
    .attr("id", "drop-shadow")
    .append("feDropShadow")
    .attr("dx", "0")
    .attr("dy", "0")
    .attr("stdDeviation", "3")
    .attr("flood-opacity", "0.3");

  // Add arrowhead marker
  defs
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#666");

  return defs;
};

export const createDragHandlers = (simulation, width, height, isLocked) => {
  const dragStarted = (event, d) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (event, d) => {
    d.fx = Math.max(60, Math.min(width - 60, event.x));
    d.fy = Math.max(60, Math.min(height - 60, event.y));
  };

  const dragEnded = (event, d) => {
    if (!event.active) simulation.alphaTarget(0);
    if (!isLocked) {
      d.fx = null;
      d.fy = null;
    }
  };

  return { dragStarted, dragged, dragEnded };
};

export const prepareGraphData = (users, groups, events, relatesTo) => {
  const nodes = [
    ...users.map((user) => ({ ...user, type: "user" })),
    ...groups.map((group) => ({ ...group, type: "group" })),
    ...events.map((event) => ({ ...event, type: "event" })),
  ];

  const edges = relatesTo.map((rel) => ({
    source: nodes.find((node) => node.id === rel.a.properties.id),
    target: nodes.find((node) => node.id === rel.b.properties.id),
    relatesTo: rel.r.properties.relatesTo,
    level: rel.r.properties.level,
  }));

  return { nodes, edges };
};
