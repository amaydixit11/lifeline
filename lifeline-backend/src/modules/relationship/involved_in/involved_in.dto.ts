// src/dtos/create-participated-in.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInvolvedInDto {
  @IsNotEmpty()
  startDate: string; // Start date of participation

  @IsNotEmpty()
  endDate: string; // End date of participation

  @IsNotEmpty()
  role: string; // Role in the event (e.g., 'attendee', 'organizer')
}
