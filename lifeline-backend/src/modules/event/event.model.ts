// src/models/event.model.ts

export class Event {
  id: string; // Unique identifier for the event
  name: string; // Name of the event
  description: string; // Description of the event
  startDate: string; // Start date of the event (ISO string format)
  endDate: string; // End date of the event (ISO string format)
}
