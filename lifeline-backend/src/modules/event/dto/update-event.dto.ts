// src/dtos/update-event.dto.ts

import { IsOptional, IsString } from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  description?: string; // Description of the event

  @IsOptional()
  startDate?: string; // Start date of the event (ISO string format)

  @IsOptional()
  endDate?: string; // End date of the event (ISO string format)
}
