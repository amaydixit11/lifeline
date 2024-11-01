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

const MemberOfTypes = [
  "Friend",
  "Family",
  "Colleague",
  "Mentor",
  "Mentee",
  "Partner",
  "Associate",
];

const AddMemberOf = () => {
  const [users, setUsers] = useState([]);
  const [fromUserId, setFromUserId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [memberOf, setMemberOf] = useState("");
  const [level, setLevel] = useState(50);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups`
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

  const handleAddMemberOf = async () => {
    if (!fromUserId || !toUserId || !memberOf) {
      // toast({
      //   title: "Validation Error",
      //   description: "Please fill in all required fields",
      //   variant: "destructive",
      // });
      return;
    }

    const newMemberOf = {
      startDate,
      endDate,
      memberOf,
      level,
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/relationship/relates-to/${fromUserId}/${toUserId}`,
        {
          fromId: fromUserId,
          toId: toUserId,
          ...newMemberOf,
        }
      );

      // toast({
      //   title: "MemberOf Added",
      //   description: `MemberOf between users established`,
      //   variant: "default",
      // });

      // Reset form
      setFromUserId("");
      setToUserId("");
      setMemberOf("");
      setLevel(50);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Error adding memberOf:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to add memberOf",
      //   variant: "destructive",
      // });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add MemberOf</CardTitle>
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
          <label className="block mb-2">MemberOf Type</label>
          <Select value={memberOf} onValueChange={setMemberOf}>
            <SelectTrigger>
              <SelectValue placeholder="Select MemberOf" />
            </SelectTrigger>
            <SelectContent>
              {MemberOfTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block mb-2">MemberOf Strength ({level}%)</label>
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
          onClick={handleAddMemberOf}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Add MemberOf
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddMemberOf;
