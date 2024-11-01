// src/models/relates-to.model.ts

export class RelatesTo {
  startDate: string; // Start date of the relationship
  endDate: string; // End date of the relationship
  relationship: string; // Type of relationship (e.g., 'friend', 'family')
  level: number; // Closeness level (1 to 100)
}
