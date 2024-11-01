// src/person/person.service.ts

import { Injectable, NotFoundException, Logger } from '@nestjs/common';

import { CreatePersonDto } from './dto/create-user.dto';
import { UpdatePersonDto } from './dto/update-user.dto';
import { Neo4jService } from 'src/database/neo4j/neo4j.service';

@Injectable()
export class PersonService {
  private readonly logger = new Logger(PersonService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async create(createPersonDto: CreatePersonDto): Promise<any> {
    const query = `
      CREATE (p:Person {id: $id, name: $name})
      RETURN p
    `;
    const params = { id: createPersonDto.id, name: createPersonDto.name };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      this.logger.log(`Created person: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error('Error creating person', error);
      throw new Error('Could not create person');
    }
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<any> {
    const query = `
      MATCH (p:Person {id: $id})
      SET p.name = $name
      RETURN p
    `;
    const params = { id, name: updatePersonDto.name };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.length === 0) {
        throw new NotFoundException('Person not found');
      }
      this.logger.log(`Updated person: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error('Error updating person', error);
      throw new Error('Could not update person');
    }
  }

  async findAll(): Promise<any[]> {
    const query = `MATCH (p:Person) RETURN p`;
    try {
      const result = await this.neo4jService.runCypher(query);
      this.logger.log(result);
      return result;
    } catch (error) {
      this.logger.error('Error finding all persons', error);
      throw new Error('Could not retrieve persons');
    }
  }

  async findOne(id: string): Promise<any> {
    const query = `
      MATCH (p:Person {id: $id})
      RETURN p
    `;
    const params = { id };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.length === 0) {
        throw new NotFoundException('Person not found');
      }
      return result[0];
    } catch (error) {
      this.logger.error('Error finding person', error);
      throw new Error('Could not find person');
    }
  }

  async delete(id: string): Promise<void> {
    const query = `
      MATCH (p:Person {id: $id})
      DELETE p
    `;
    const params = { id };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.length === 0) {
        throw new NotFoundException('Person not found');
      }
      this.logger.log(`Deleted person with id: ${id}`);
    } catch (error) {
      this.logger.error('Error deleting person', error);
      throw new Error('Could not delete person');
    }
  }
}
