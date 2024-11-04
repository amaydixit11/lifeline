// Define node configuration for each type
export const nodeConfig = (edges) => {
  return {
    user: {
      radius: (d) => {
        const connectionCount = edges.filter(
          (e) => e.source.id === d.id || e.target.id === d.id
        ).length;
        return Math.max(35, Math.min(55, 25 + connectionCount * 2.5));
      },
      gradient: {
        colors: ["#60A5FA", "#2563EB"], // Blue gradient
        innerRadius: "30%",
        outerRadius: "70%",
      },
      strokeColor: "#1E40AF",
      labelOffset: 45,
      icon: "M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z M14 13H10C6.68629 13 4 15.6863 4 19V21H20V19C20 15.6863 17.3137 13 14 13Z",
    },
    group: {
      radius: (d) => {
        const connectionCount = edges.filter(
          (e) => e.source.id === d.id || e.target.id === d.id
        ).length;
        return Math.max(40, Math.min(60, 30 + connectionCount * 2));
      },
      gradient: {
        colors: ["#34D399", "#059669"], // Green gradient
        innerRadius: "20%",
        outerRadius: "80%",
      },
      strokeColor: "#047857",
      labelOffset: 50,
      icon: "M17 20H7C4.79086 20 3 18.2091 3 16V8C3 5.79086 4.79086 4 7 4H17C19.2091 4 21 5.79086 21 8V16C21 18.2091 19.2091 20 17 20ZM7 8V16H17V8H7Z",
    },
    event: {
      radius: (d) => {
        const connectionCount = edges.filter(
          (e) => e.source.id === d.id || e.target.id === d.id
        ).length;
        return Math.max(30, Math.min(50, 20 + connectionCount * 3));
      },
      gradient: {
        colors: ["#F472B6", "#DB2777"], // Pink gradient
        innerRadius: "40%",
        outerRadius: "60%",
      },
      strokeColor: "#BE185D",
      labelOffset: 40,
      icon: "M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z",
    },
  };
};
