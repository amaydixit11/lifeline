// src/group/group.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Group } from './group.model';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Neo4jService } from '../../database/neo4j/neo4j.service'; // Import your Neo4jService

@Injectable()
export class GroupService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const query = `
      CREATE (g:Group {id: $id, name: $name})
      RETURN g
    `;

    const params = {
      id: createGroupDto.id,
      name: createGroupDto.name,
    };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      return result.records[0].get('g').properties;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create group');
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const query = `
      MATCH (g:Group {id: $id})
      SET g.name = $name
      RETURN g
    `;
    const params = { id, name: updateGroupDto.name };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.records.length === 0) {
        throw new NotFoundException('Group not found');
      }
      return result.records[0].get('g').properties;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update group');
    }
  }

  async findAll(): Promise<Group[]> {
    const query = 'MATCH (g:Group) RETURN g';

    try {
      const result = await this.neo4jService.runCypher(query);
      return result.records.map((record) => record.get('g').properties);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch groups');
    }
  }

  async findOne(id: string): Promise<Group> {
    const query = 'MATCH (g:Group {id: $id}) RETURN g';
    const params = { id };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.records.length === 0) {
        throw new NotFoundException('Group not found');
      }
      return result.records[0].get('g').properties;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch group');
    }
  }

  async delete(id: string): Promise<void> {
    const query = 'MATCH (g:Group {id: $id}) DELETE g';
    const params = { id };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.summary.counters.updates().nodesDeleted === 0) {
        throw new NotFoundException('Group not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete group');
    }
  }
}
