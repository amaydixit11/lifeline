// src/dtos/create-relates-to.dto.ts

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRelatesToDto {
  @IsNotEmpty()
  startDate: string; // Start date of the relationship

  @IsNotEmpty()
  endDate: string; // End date of the relationship

  @IsNotEmpty()
  relationship: string; // Type of relationship (e.g., 'friend', 'family')

  @IsNotEmpty()
  level: number; // Closeness level (1 to 100)
}
