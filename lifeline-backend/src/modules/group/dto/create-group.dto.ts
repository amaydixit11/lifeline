// src/dtos/create-group.dto.ts

import { IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  id: string; // Unique identifier for the group

  @IsNotEmpty()
  name: string; // Name of the group
}
