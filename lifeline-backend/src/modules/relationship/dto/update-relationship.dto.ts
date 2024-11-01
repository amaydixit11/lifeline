// src/modules/relationship/dto/update-relationship.dto.ts
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class UpdateRelationshipDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  friendId?: string;

  @IsOptional()
  @IsInt()
  level?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string; // Nullable if the relationship is ongoing
}
