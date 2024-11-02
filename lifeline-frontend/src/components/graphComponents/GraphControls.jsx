// components/GraphControls.jsx
import { ZoomIn, ZoomOut, Lock, Unlock, RefreshCw, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const GraphControls = ({
  handleZoom,
  isLocked,
  setIsLocked,
  resetGraph,
  toggleLegend,
}) => (
  <div className="flex space-x-2">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-all transform hover:scale-105 active:scale-95"
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
            className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-all transform hover:scale-105 active:scale-95"
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
            className="bg-purple-50 text-purple-600 p-2 rounded-lg hover:bg-purple-100 transition-all transform hover:scale-105 active:scale-95"
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
            className="bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 transition-all transform hover:scale-105 active:scale-95"
            onClick={resetGraph}
          >
            <RefreshCw size={18} />
          </button>
        </TooltipTrigger>
        <TooltipContent>Reset Graph</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="bg-indigo-50 text-indigo-600 p-2 rounded-lg hover:bg-indigo-100 transition-all transform hover:scale-105 active:scale-95"
            onClick={toggleLegend}
          >
            <Info size={18} />
          </button>
        </TooltipTrigger>
        <TooltipContent>Toggle Legend</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);
