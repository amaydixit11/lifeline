"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddUser from "@/components/AddUser";
import AddGroup from "@/components/AddGroup";
import AddEvent from "@/components/AddEvent";
import AddRelatesTo from "@/components/AddRelatesTo";
import AddMemberOf from "@/components/AddMemberOf";
import AddInvolvedIn from "@/components/AddInvolvedIn";
import GraphContainer from "@/components/GraphContainer";
import Timeline from "@/components/Timeline";

const Home = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col h-full">
        <h1 className="text-3xl font-bold py-4 text-center text-blue-400">
          The Unknown Verse
        </h1>

        <Tabs
          defaultValue="graph"
          className="flex flex-col h-full overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-800">
            <TabsTrigger value="graph">Network Graph</TabsTrigger>
            <TabsTrigger value="add-nodes">Add Node</TabsTrigger>
            <TabsTrigger value="add-relationship">Add Relationship</TabsTrigger>
          </TabsList>

          <div className="px-4">
            <Timeline />
          </div>

          <TabsContent value="graph" className="flex-grow overflow-hidden">
            <Card className="h-full p-4 bg-gray-800 border-gray-700 overflow-auto">
              <GraphContainer />
            </Card>
          </TabsContent>

          <TabsContent value="add-nodes" className="flex-grow overflow-hidden">
            <Card className="h-full p-4 bg-gray-800 border-gray-700 overflow-auto">
              <AddUser />
              <div className="h-8"></div>
              <AddGroup />
              <div className="h-8"></div>
              <AddEvent />
            </Card>
          </TabsContent>

          <TabsContent
            value="add-relationship"
            className="flex-grow overflow-hidden"
          >
            <Card className="h-full p-4 bg-gray-800 border-gray-700 overflow-auto">
              <AddRelatesTo />
              <div className="h-2"></div>
              <AddMemberOf />
              <div className="h-2"></div>
              <AddInvolvedIn />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
