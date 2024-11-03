// Define default node configurations
const DEFAULT_NODE_CONFIG = {
  gradient: {
    startColor: "#E5E7EB",
    endColor: "#9CA3AF",
  },
  strokeColor: "#6B7280",
  radius: (d) => 35,
  hoverColor: "#4B5563",
};

export const defaultNodeConfig = {
  user: {
    gradient: {
      colors: ["#60A5FA", "#2563EB"], // Blue gradient
    },
    strokeColor: "#1E40AF",
    radius: (d) => Math.max(35, Math.min(55, 25 + (d.connections || 0) * 2.5)),
    icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", // User icon path
    labelOffset: 40,
  },
  group: {
    gradient: {
      colors: ["#34D399", "#059669"], // Green gradient
    },
    strokeColor: "#047857",
    radius: (d) => Math.max(40, Math.min(60, 30 + (d.connections || 0) * 2)),
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", // Group icon path
    labelOffset: 45,
  },
  event: {
    gradient: {
      colors: ["#F472B6", "#DB2777"], // Pink gradient
    },
    strokeColor: "#BE185D",
    radius: (d) => Math.max(30, Math.min(50, 20 + (d.connections || 0) * 3)),
    icon: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z", // Event icon path
    labelOffset: 35,
  },
};

export const createGradientDefs = (svg, customNodeConfig = {}) => {
  const nodeConfig = { ...defaultNodeConfig, ...customNodeConfig };
  const defs = svg.append("defs");

  // Create gradient definitions for nodes
  Object.entries(nodeConfig).forEach(([type, config]) => {
    // Radial gradient for nodes
    const radialGradient = defs
      .append("radialGradient")
      .attr("id", `gradient-${type}`)
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "70%")
      .attr("fx", "50%")
      .attr("fy", "50%");

    radialGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", config.gradient.colors[0])
      .attr("stop-opacity", 0.9);

    radialGradient
      .append("stop")
      .attr("offset", "70%")
      .attr("stop-color", config.gradient.colors[1])
      .attr("stop-opacity", 1);

    // Hover gradient
    const hoverGradient = defs
      .append("radialGradient")
      .attr("id", `gradient-${type}-hover`)
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "70%")
      .attr("fx", "50%")
      .attr("fy", "50%");

    hoverGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", config.gradient.colors[0])
      .attr("stop-opacity", 1);

    hoverGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", config.gradient.colors[1])
      .attr("stop-opacity", 1);
  });

  // Add drop shadow filter
  const filter = defs
    .append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%");

  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 3)
    .attr("result", "blur");

  filter
    .append("feOffset")
    .attr("in", "blur")
    .attr("dx", 2)
    .attr("dy", 2)
    .attr("result", "offsetBlur");

  const feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "offsetBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  // Edge markers
  const markerColors = {
    RELATES_TO: "#6B7280",
    MEMBER_OF: "#4B5563",
    PARTICIPATES_IN: "#374151",
  };

  Object.entries(markerColors).forEach(([type, color]) => {
    defs
      .append("marker")
      .attr("id", `arrow-${type}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", color);
  });

  return defs;
};

export const createDragHandlers = (simulation, width, height, isLocked) => {
  const dragStarted = (event, d) => {
    if (!event.active) {
      simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (event, d) => {
    const radius = defaultNodeConfig[d.type].radius(d);
    d.fx = Math.max(radius, Math.min(width - radius, event.x));
    d.fy = Math.max(radius, Math.min(height - radius, event.y));
  };

  const dragEnded = (event, d) => {
    if (!event.active) {
      simulation.alphaTarget(0);
    }
    if (!isLocked) {
      d.fx = null;
      d.fy = null;
    }
  };

  return { dragStarted, dragged, dragEnded };
};

export const prepareGraphData = (
  users,
  groups,
  events,
  relatesTo,
  memberOf
) => {
  // Process nodes
  const nodes = [
    ...users.map((user) => ({
      ...user,
      type: "user",
      connections: 0,
    })),
    ...groups.map((group) => ({
      ...group,
      type: "group",
      connections: 0,
    })),
    ...events.map((event) => ({
      ...event,
      type: "event",
      connections: 0,
    })),
  ];

  // Process edges
  const relatesToEdges = relatesTo
    .map((rel) => {
      const source = nodes.find((node) => node.id === rel.a.properties.id);
      const target = nodes.find((node) => node.id === rel.b.properties.id);

      if (source) source.connections = (source.connections || 0) + 1;
      if (target) target.connections = (target.connections || 0) + 1;

      return {
        source,
        target,
        type: "RELATES_TO",
        relatesTo: rel.r.properties.relatesTo,
        level: rel.r.properties.level || 1,
        strength: rel.r.properties.level || 1,
      };
    })
    .filter((edge) => edge.source && edge.target);

  const memberOfEdges = memberOf
    .map((mem) => {
      const source = nodes.find((node) => node.id === mem.u.properties.id);
      const target = nodes.find((node) => node.id === mem.g.properties.id);

      if (source) source.connections = (source.connections || 0) + 1;
      if (target) target.connections = (target.connections || 0) + 1;

      return {
        source,
        target,
        type: "MEMBER_OF",
        strength: 2,
      };
    })
    .filter((edge) => edge.source && edge.target);

  const edges = [...relatesToEdges, ...memberOfEdges];

  return { nodes, edges };
};

export const getEdgeStyling = (edge) => ({
  strokeWidth: `${edge.strength || 1}px`,
  opacity: 0.6 + (edge.strength || 1) * 0.1,
  marker: `url(#arrow-${edge.type})`,
});
