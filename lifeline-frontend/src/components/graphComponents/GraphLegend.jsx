import React from "react";
import { Users, Folders, Calendar, Connection } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const NodeTypeIcon = ({ type }) => {
  const icons = {
    user: <Users className="w-4 h-4" />,
    group: <Folders className="w-4 h-4" />,
    event: <Calendar className="w-4 h-4" />,
  };
  return icons[type] || null;
};

export const GraphLegend = ({ nodeConfig }) => {
  const legendConfig = {
    user: {
      label: "Users",
      description: "Individual network members",
      gradient: ["#60A5FA", "#2563EB"],
    },
    group: {
      label: "Groups",
      description: "Collaborative spaces",
      gradient: ["#34D399", "#059669"],
    },
    event: {
      label: "Events",
      description: "Time-based activities",
      gradient: ["#F472B6", "#DB2777"],
    },
  };

  return (
    <Card className="absolute top-4 left-4 w-64 bg-white/95 backdrop-blur-sm z-10">
      <CardContent className="p-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Network Elements
            </h3>
            <div className="space-y-3">
              {Object.entries(legendConfig).map(([type, config]) => (
                <div key={type} className="group">
                  <div className="flex items-center space-x-3 mb-1">
                    <div className="relative">
                      <div
                        className="w-8 h-8 rounded-full shadow-md"
                        style={{
                          background: `radial-gradient(circle at center, ${config.gradient[0]} 30%, ${config.gradient[1]} 70%)`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <NodeTypeIcon type={type} />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {config.label}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {config.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Connection Strength
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="h-0.5 w-12 bg-gray-300" />
                <span className="text-xs text-gray-600">Weak Connection</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-1 w-12 bg-gray-400" />
                <span className="text-xs text-gray-600">Medium Connection</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-1.5 w-12 bg-gray-500" />
                <span className="text-xs text-gray-600">Strong Connection</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            <p>
              • Node size indicates connection count
              <br />• Hover over nodes for details
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GraphLegend;
