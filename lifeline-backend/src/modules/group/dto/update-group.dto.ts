// src/dtos/update-group.dto.ts

import { IsOptional, IsString } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  name?: string; // Name of the group
}
