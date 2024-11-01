"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/toaster";

const AddUser = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddUser = async () => {
    if (!userName.trim()) {
      // toast({
      //   title: "Validation Error",
      //   description: "Please enter a valid name",
      //   variant: "destructive",
      // });
      return;
    }

    setLoading(true);
    const newUser = {
      id: uuidv4(),
      name: userName.trim(),
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/persons`,
        newUser
      );
      console.log("Person added:", response);

      // toast({
      //   title: "User Added",
      //   description: `${userName} has been added to the network`,
      //   variant: "default",
      // });

      setUserName(""); // Clear input field after adding
    } catch (error) {
      console.error("Error adding person:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to add user. Please try again.",
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
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter person's name"
          className="flex-grow"
        />
        <Button
          onClick={handleAddUser}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add User"}
        </Button>
      </div>
      <p className="text-sm text-gray-400">
        Enter a unique name for the person you want to add to the network.
      </p>
    </div>
  );
};

export default AddUser;
