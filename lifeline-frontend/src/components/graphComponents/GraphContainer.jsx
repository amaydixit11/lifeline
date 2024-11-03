import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  BookUser,
  Network,
  RefreshCw,
  PlusCircle,
  AlertTriangle,
} from "lucide-react";
import Graph from "@/components/graphComponents/Graph";

const backend_url =
  process.env.NEXT_PUBLIC_ENVIRONMENT == "development"
    ? "http://localhost:8080"
    : process.env.NEXT_PUBLIC_BACKEND_URL;
// Helper function to extract users
const extractUsers = (data) =>
  data?.map((item) => ({
    id: item.p.properties.id,
    name: item.p.properties.name,
  })) || [];

const extractGroups = (data) =>
  data?.map((item) => ({
    id: item.g.properties.id,
    name: item.g.properties.name,
  })) || [];

const extractEvents = (data) =>
  data
    ?.map((item) => {
      if (!item.e || !item.e.properties) {
        console.log(
          `item doesn't have e or properties: ${JSON.stringify(item)}`
        );
        return null;
      }

      return {
        id: item.e.properties.id,
        name: item.e.properties.name,
        endDate: item.e.properties.endDate,
        description: item.e.properties.description,
        startDate: item.e.properties.startDate,
      };
    })
    .filter((event) => event !== null) || [];

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <RefreshCw className="animate-spin text-blue-500" size={48} />
    <p className="text-gray-300">Loading network...</p>
  </div>
);

// Error Component
const ErrorDisplay = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center space-y-4 p-6">
    <AlertTriangle className="text-red-500" size={48} />
    <h2 className="text-lg text-red-400 font-semibold">Network Error</h2>
    <p className="text-gray-300 text-center">{message}</p>
    <button
      onClick={onRetry}
      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
    >
      <RefreshCw size={16} />
      <span>Retry</span>
    </button>
  </div>
);

// Empty State Component
const EmptyState = ({ onAddUser }) => (
  <div className="flex flex-col items-center justify-center space-y-4 p-6">
    <Network className="text-gray-400" size={48} />
    <h2 className="text-xl text-gray-200 font-semibold">
      Your network is empty
    </h2>
    <p className="text-gray-400 text-center">
      Start by adding your first connection
    </p>
    <button
      onClick={onAddUser}
      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300"
    >
      <PlusCircle size={16} />
      <span>Add First Connection</span>
    </button>
  </div>
);

const GraphContainer = () => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [relatesTo, setRelatesTo] = useState([]);
  const [memberOf, setMemberOf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        usersResponse,
        groupsResponse,
        eventsResponse,
        relatesToResponse,
        memberOfResponse,
      ] = await Promise.all([
        axios.get(`${backend_url}/persons`),
        axios.get(`${backend_url}/groups`),
        axios.get(`${backend_url}/events`),
        axios.get(`${backend_url}/relationship/relates-to`),
        axios.get(`${backend_url}/relationship/member-of`),
      ]);

      setUsers(extractUsers(usersResponse.data));
      setEvents(extractEvents(eventsResponse.data));
      setGroups(extractGroups(groupsResponse.data));
      setRelatesTo(relatesToResponse.data);
      setMemberOf(memberOfResponse.data);

      console.log(usersResponse.data);
      console.log(eventsResponse.data);
      console.log(groupsResponse.data);
      console.log(relatesToResponse.data);
      console.log(memberOfResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Unable to load network. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddUser = () => {
    // Implement add user logic or open a modal
    // This is a placeholder for your actual add user implementation
    console.log("Open add user modal");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BookUser className="text-blue-500" size={32} />
          <h1 className="text-2xl font-bold text-white">Network Visualizer</h1>
        </div>
        <button
          onClick={fetchData}
          className="text-blue-400 hover:text-blue-300 transition duration-300"
        >
          <RefreshCw size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorDisplay message={error} onRetry={fetchData} />
          ) : users.length === 0 ? (
            <EmptyState onAddUser={handleAddUser} />
          ) : (
            <Graph
              users={users}
              groups={groups}
              events={events}
              relatesTo={relatesTo}
              memberOf={memberOf}
              className="w-full h-[600px]"
            />
          )}
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-gray-800 p-4 text-center text-gray-400">
        <p>© 2024 Network Visualizer | Powered by D3.js</p>
      </footer> */}
    </div>
  );
};

export default GraphContainer;
