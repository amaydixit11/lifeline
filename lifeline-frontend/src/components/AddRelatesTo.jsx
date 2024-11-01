"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const extractUsers = (data) =>
  data?.map((item) => ({
    id: item.p.properties.id,
    name: item.p.properties.name,
  })) || [];

const RelatedToTypes = [
  "Friend",
  "Family",
  "Colleague",
  "Mentor",
  "Mentee",
  "Partner",
  "Associate",
];

const AddRelatedTo = () => {
  const [users, setUsers] = useState([]);
  const [fromUserId, setFromUserId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [relatedTo, setRelatedTo] = useState("");
  const [level, setLevel] = useState(50);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/persons`
      );
      setUsers(extractUsers(response.data));
    } catch (error) {
      console.error("Error fetching persons:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to load users",
      //   variant: "destructive",
      // });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddRelatedTo = async () => {
    if (!fromUserId || !toUserId || !relatedTo) {
      // toast({
      //   title: "Validation Error",
      //   description: "Please fill in all required fields",
      //   variant: "destructive",
      // });
      return;
    }

    const newRelatedTo = {
      startDate,
      endDate,
      relatedTo,
      level,
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/relationship/relates-to/${fromUserId}/${toUserId}`,
        {
          fromId: fromUserId,
          toId: toUserId,
          ...newRelatedTo,
        }
      );

      // toast({
      //   title: "RelatedTo Added",
      //   description: `RelatedTo between users established`,
      //   variant: "default",
      // });

      // Reset form
      setFromUserId("");
      setToUserId("");
      setRelatedTo("");
      setLevel(50);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Error adding relatedTo:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to add relatedTo",
      //   variant: "destructive",
      // });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add RelatedTo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">From User</label>
            <Select value={fromUserId} onValueChange={setFromUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select From User" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">To User</label>
            <Select value={toUserId} onValueChange={setToUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select To User" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block mb-2">RelatedTo Type</label>
          <Select value={relatedTo} onValueChange={setRelatedTo}>
            <SelectTrigger>
              <SelectValue placeholder="Select RelatedTo" />
            </SelectTrigger>
            <SelectContent>
              {RelatedToTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block mb-2">RelatedTo Strength ({level}%)</label>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            onValueChange={(value) => setLevel(value[0])}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleAddRelatedTo}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Add RelatedTo
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddRelatedTo;
