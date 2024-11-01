// src/dtos/create-event.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  id: string; // Unique identifier for the event

  @IsNotEmpty()
  description: string; // Description of the event

  @IsNotEmpty()
  startDate: string; // Start date of the event (ISO string format)

  @IsNotEmpty()
  endDate: string; // End date of the event (ISO string format)
}
