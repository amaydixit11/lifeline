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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const backend_url =
  process.env.NEXT_PUBLIC_ENVIRONMENT == "development"
    ? "http://localhost:8080"
    : process.env.NEXT_PUBLIC_BACKEND_URL;

const extractGroupNodes = (data) =>
  data?.map((item) => ({
    id: item.g.properties.id,
    name: item.g.properties.name,
  })) || [];
const extractPersonNodes = (data) =>
  data?.map((item) => ({
    id: item.p.properties.id,
    name: item.p.properties.name,
  })) || [];

const AddMemberOf = () => {
  const [groups, setGroups] = useState([]);
  const [persons, setPersons] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [personId, setPersonId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    console.log("Fetching groups from backend...");
    try {
      const response = await axios.get(`${backend_url}/groups`);
      const groupData = extractGroupNodes(response.data);
      console.log("Fetched groups:", groupData);
      setGroups(groupData);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
      console.log("Finished fetching groups.");
    }
  }, []);

  const fetchPersons = useCallback(async () => {
    setLoading(true);
    console.log("Fetching persons from backend...");
    try {
      const response = await axios.get(`${backend_url}/persons`);
      const personData = extractPersonNodes(response.data);
      console.log("Fetched persons:", personData);
      setPersons(personData);
    } catch (error) {
      console.error("Error fetching persons:", error);
    } finally {
      setLoading(false);
      console.log("Finished fetching persons.");
    }
  }, []);

  useEffect(() => {
    console.log("Calling fetchGroups and fetchPersons...");
    fetchGroups();
    fetchPersons();
  }, [fetchGroups, fetchPersons]);

  const handleAddMemberOf = async () => {
    if (!groupId || !personId) {
      console.warn("Group ID or Person ID is missing, aborting request.");
      return;
    }

    const membershipData = {
      startDate,
      endDate,
    };

    console.log("Submitting new membership:", {
      groupId,
      personId,
      membershipData,
    });

    try {
      await axios.post(
        `${backend_url}/relationship/member-of/${personId}/${groupId}`,
        membershipData
      );

      // Reset form
      console.log("Membership added successfully. Resetting form...");
      setGroupId("");
      setPersonId("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Error adding membership:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Group Membership</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Group</label>
            <Select
              value={groupId}
              onValueChange={(value) => {
                console.log("Group selected:", value);
                setGroupId(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">Person</label>
            <Select
              value={personId}
              onValueChange={(value) => {
                console.log("Person selected:", value);
                setPersonId(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Person" />
              </SelectTrigger>
              <SelectContent>
                {persons.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                console.log("Start date set to:", e.target.value);
                setStartDate(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="block mb-2">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                console.log("End date set to:", e.target.value);
                setEndDate(e.target.value);
              }}
            />
          </div>
        </div>

        <Button
          onClick={handleAddMemberOf}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Processing..." : "Add Membership"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddMemberOf;
