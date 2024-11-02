// components/GraphStats.jsx
export const GraphStats = ({ users, groups, events, relatesTo, zoomLevel }) => (
  <div className="absolute bottom-4 right-4 flex space-x-4">
    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-100">
      <div className="text-sm text-gray-600">Nodes</div>
      <div className="font-semibold text-lg">
        {users.length + groups.length + events.length}
      </div>
    </div>
    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-100">
      <div className="text-sm text-gray-600">Connections</div>
      <div className="font-semibold text-lg">{relatesTo.length}</div>
    </div>
    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-100">
      <div className="text-sm text-gray-600">Zoom</div>
      <div className="font-semibold text-lg">
        {(zoomLevel * 100).toFixed(0)}%
      </div>
    </div>
  </div>
);
