// src/dtos/create-person.dto.ts

import { IsNotEmpty } from 'class-validator';

export class CreatePersonDto {
  @IsNotEmpty()
  id: string; // Unique identifier for the person

  @IsNotEmpty()
  name: string; // Name of the person
}
