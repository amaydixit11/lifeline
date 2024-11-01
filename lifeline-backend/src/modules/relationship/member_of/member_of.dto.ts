// src/dtos/create-member-of.dto.ts

import { IsNotEmpty } from 'class-validator';

export class CreateMemberOfDto {
  @IsNotEmpty()
  startDate: string; // Start date of membership

  @IsNotEmpty()
  endDate: string; // End date of membership
}
