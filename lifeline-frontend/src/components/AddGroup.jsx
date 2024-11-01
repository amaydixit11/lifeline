"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/toaster";

const AddGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddGroup = async () => {
    if (!groupName.trim()) {
      // toast({
      //   title: "Validation Error",
      //   description: "Please enter a valid name",
      //   variant: "destructive",
      // });
      return;
    }

    setLoading(true);
    const newGroup = {
      id: uuidv4(),
      name: groupName.trim(),
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups`,
        newGroup
      );

      // toast({
      //   title: "Group Added",
      //   description: `${groupName} has been added to the network`,
      //   variant: "default",
      // });

      setGroupName(""); // Clear input field after adding
    } catch (error) {
      console.error("Error adding group:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to add group. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group's name"
          className="flex-grow"
        />
        <Button
          onClick={handleAddGroup}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Group"}
        </Button>
      </div>
      <p className="text-sm text-gray-400">
        Enter a unique name for the group you want to add to the network.
      </p>
    </div>
  );
};

export default AddGroup;
