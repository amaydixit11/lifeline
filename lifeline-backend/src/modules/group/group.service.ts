// src/group/group.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Group } from './group.model';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Neo4jService } from '../../database/neo4j/neo4j.service';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    this.logger.log('Creating a new group with data:', createGroupDto);
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
      this.logger.log(
        `Group created successfully with id: ${createGroupDto.id}`,
      );
      return result;
    } catch (error) {
      this.logger.error('Failed to create group:', error);
      throw new InternalServerErrorException('Failed to create group');
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    this.logger.log(`Updating group with id: ${id}`, updateGroupDto);
    const query = `
      MATCH (g:Group {id: $id})
      SET g.name = $name
      RETURN g
    `;
    const params = { id, name: updateGroupDto.name };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.records.length === 0) {
        this.logger.warn(`Group not found for id: ${id}`);
        throw new NotFoundException('Group not found');
      }
      this.logger.log(`Group updated successfully with id: ${id}`);
      return result.records[0].get('g').properties;
    } catch (error) {
      this.logger.error(`Failed to update group with id: ${id}`, error);
      throw new InternalServerErrorException('Failed to update group');
    }
  }

  async findAll(): Promise<Group[]> {
    this.logger.log('Fetching all groups');
    const query = 'MATCH (g:Group) RETURN g';

    try {
      const result = await this.neo4jService.runCypher(query);
      this.logger.log(`Fetched ${result} groups`);
      // return result.records.map((record) => record.get('g').properties);
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch groups', error);
      throw new InternalServerErrorException('Failed to fetch groups');
    }
  }

  async findOne(id: string): Promise<Group> {
    this.logger.log(`Fetching group with id: ${id}`);
    const query = 'MATCH (g:Group {id: $id}) RETURN g';
    const params = { id };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.records.length === 0) {
        this.logger.warn(`Group not found for id: ${id}`);
        throw new NotFoundException('Group not found');
      }
      this.logger.log(`Fetched group with id: ${id}`);
      return result.records[0].get('g').properties;
    } catch (error) {
      this.logger.error(`Failed to fetch group with id: ${id}`, error);
      throw new InternalServerErrorException('Failed to fetch group');
    }
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting group with id: ${id}`);
    const query = 'MATCH (g:Group {id: $id}) DELETE g';
    const params = { id };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.summary.counters.updates().nodesDeleted === 0) {
        this.logger.warn(`Group not found for id: ${id}`);
        throw new NotFoundException('Group not found');
      }
      this.logger.log(`Group deleted successfully with id: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete group with id: ${id}`, error);
      throw new InternalServerErrorException('Failed to delete group');
    }
  }
}
