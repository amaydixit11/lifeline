// src/modules/relationship/dto/create-relationship.dto.ts
import { IsString, IsInt, IsDateString } from 'class-validator';

export class CreateRelationshipDto {
  @IsString()
  userId: string;

  @IsString()
  friendId: string;

  @IsInt()
  level: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string; // Nullable if the relationship is ongoing
}
