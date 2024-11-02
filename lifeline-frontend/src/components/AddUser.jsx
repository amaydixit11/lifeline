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
import { UserPlus } from "lucide-react";

const AddUser = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!userName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid name",
        variant: "destructive",
      });
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

      toast({
        title: "Success",
        description: `${userName} has been added to the network`,
        variant: "default",
      });

      setUserName("");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add user. Please try again. ${error}`,
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
          <UserPlus className="w-5 h-5" />
          Add Person
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-sm text-gray-200">
              Persons Name
            </Label>
            <div className="flex gap-2">
              <Input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter persons name"
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
            Enter a unique name for the person you want to add to the network.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddUser;
