// src/models/relates-to.model.ts

export class RelatesTo {
  startDate: string; // Start date of the relationship
  endDate: string; // End date of the relationship
  relationship: string; // Type of relationship (e.g., 'friend', 'family')
  level: number; // Closeness level (1 to 100)
}

// src/models/member-of.model.ts

export class MemberOf {
  startDate: string; // Start date of membership
  endDate: string; // End date of membership
}

// src/models/participated-in.model.ts

export class InvolvedIn {
  startDate: string; // Start date of participation
  endDate: string; // End date of participation
  role: string; // Role in the event (e.g., 'attendee', 'organizer')
}
