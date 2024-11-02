// components/GraphLegend.jsx
import { UserSquare2, Info } from "lucide-react";

export const GraphLegend = ({ nodeConfig, relatesToConfig }) => (
  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg z-10 border border-gray-100">
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <UserSquare2 className="w-4 h-4 mr-2" />
          Node Types
        </h3>
        <div className="space-y-2">
          {Object.entries(nodeConfig).map(([type, config]) => (
            <div key={type} className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded-full shadow-sm flex items-center justify-center"
                style={{
                  background: `linear-gradient(45deg, ${config.color}, ${config.hoverColor})`,
                }}
              />
              <div className="flex items-center space-x-2">
                {config.icon}
                <span className="capitalize text-gray-700">{type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Info className="w-4 h-4 mr-2" />
          Relationship Types
        </h3>
        <div className="space-y-2">
          {Object.entries(relatesToConfig).map(([type, { color, icon }]) => (
            <div key={type} className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded-full shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-xl" role="img" aria-label={type}>
                {icon}
              </span>
              <span className="text-gray-700">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
