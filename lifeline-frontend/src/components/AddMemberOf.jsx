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
import { Slider } from "@/components/ui/slider";

const extractNodes = (data) =>
  data?.map((item) => ({
    id: item.p.properties.id,
    name: item.p.properties.name,
  })) || [];

const MemberOfTypes = [
  "Core Member",
  "Regular Member",
  "Associate Member",
  "Honorary Member",
  "Administrator",
  "Moderator",
  "Contributor",
  "Observer",
];

const AddMemberOf = () => {
  const [groups, setGroups] = useState([]);
  const [persons, setPersons] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [personId, setPersonId] = useState("");
  const [memberType, setMemberType] = useState("");
  const [participationLevel, setParticipationLevel] = useState(50);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups`
      );
      setGroups(extractNodes(response.data));
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPersons = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/persons`
      );
      setPersons(extractNodes(response.data));
    } catch (error) {
      console.error("Error fetching persons:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
    fetchPersons();
  }, [fetchGroups, fetchPersons]);

  const handleAddMemberOf = async () => {
    if (!groupId || !personId || !memberType) {
      return;
    }

    const membershipData = {
      startDate,
      endDate,
      membershipType: memberType,
      participationLevel,
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/relationship/member-of/${groupId}/${personId}`,
        membershipData
      );

      // Reset form
      setGroupId("");
      setPersonId("");
      setMemberType("");
      setParticipationLevel(50);
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
            <Select value={groupId} onValueChange={setGroupId}>
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
            <Select value={personId} onValueChange={setPersonId}>
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

        <div>
          <label className="block mb-2">Membership Type</label>
          <Select value={memberType} onValueChange={setMemberType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Membership Type" />
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
          <label className="block mb-2">
            Participation Level ({participationLevel}%)
          </label>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            onValueChange={(value) => setParticipationLevel(value[0])}
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
          disabled={loading}
        >
          {loading ? "Processing..." : "Add Membership"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddMemberOf;
