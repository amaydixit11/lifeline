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

const backend_url =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
    ? "http://localhost:8080"
    : process.env.NEXT_PUBLIC_BACKEND_URL;

const extractPersons = (data) =>
  data?.map((item) => ({
    id: item.p.properties.id,
    name: item.p.properties.name,
  })) || [];
const extractEvents = (data) =>
  data?.map((item) => ({
    id: item.e.properties.id,
    name: item.e.properties.name,
  })) || [];

const InvolvedInTypes = [
  "Main Role",
  "Side Role",
  "Cameo",
  "Supporting Character",
];

const AddInvolvedIn = () => {
  const [persons, setPersons] = useState([]);
  const [events, setEvents] = useState([]);
  const [personId, setPersonId] = useState("");
  const [eventId, setEventId] = useState("");
  const [involvedIn, setInvolvedIn] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPersons = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backend_url}/persons`);
      setPersons(extractPersons(response.data));
    } catch (error) {
      console.error("Error fetching persons:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backend_url}/events`);
      setEvents(extractEvents(response.data));
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Calling fetchEvents and fetchPersons...");
    fetchEvents();
    fetchPersons();
  }, [fetchEvents, fetchPersons]);

  const handleAddInvolvedIn = async () => {
    if (!personId || !eventId || !involvedIn) {
      return;
    }

    const newInvolvedIn = {
      startDate,
      endDate,
      role: involvedIn,
    };

    try {
      await axios.post(
        `${backend_url}/relationship/involved-in/${personId}/${eventId}`,
        newInvolvedIn
      );

      // Reset form
      setPersonId("");
      setEventId("");
      setInvolvedIn("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Error adding involvedIn:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Involved In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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

          <div>
            <label className="block mb-2">Event</label>
            <Select value={eventId} onValueChange={setEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block mb-2">Involved In Type</label>
          <Select value={involvedIn} onValueChange={setInvolvedIn}>
            <SelectTrigger>
              <SelectValue placeholder="Select Involved In" />
            </SelectTrigger>
            <SelectContent>
              {InvolvedInTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          onClick={handleAddInvolvedIn}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Add Involved In
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddInvolvedIn;
