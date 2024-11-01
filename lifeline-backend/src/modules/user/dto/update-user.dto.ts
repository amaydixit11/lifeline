// src/dtos/update-person.dto.ts

import { IsOptional, IsString } from 'class-validator';

export class UpdatePersonDto {
  @IsOptional()
  @IsString()
  name?: string; // Name of the person
}
