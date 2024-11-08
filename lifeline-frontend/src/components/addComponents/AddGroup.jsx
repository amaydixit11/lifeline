"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

const backend_url =
  process.env.NEXT_PUBLIC_ENVIRONMENT == "development"
    ? "http://localhost:8080"
    : process.env.NEXT_PUBLIC_BACKEND_URL;

const AddGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddGroup = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const newGroup = {
      id: uuidv4(),
      name: groupName.trim(),
    };

    try {
      const response = await axios.post(`${backend_url}/groups`, newGroup);
      console.log("Group added:", response);

      toast({
        title: "Success",
        description: `${groupName} has been added to the network`,
        variant: "default",
      });

      setGroupName("");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add group. Please try again. ${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="w-5 h-5" />
          Add Group
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddGroup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm text-gray-200">
              Group Name
            </Label>
            <div className="flex gap-2">
              <Input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group's name"
                className="flex-grow bg-gray-700 border-gray-600 text-white"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Enter a unique name for the group you want to add to the network.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddGroup;
