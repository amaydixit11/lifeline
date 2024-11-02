// src/event/event.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Event } from './event.model';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Neo4jService } from '../../database/neo4j/neo4j.service'; // Import your Neo4jService

@Injectable()
export class EventService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const query = `
      CREATE (e:Event {id: $id, name: $name, description: $description, startDate: $startDate, endDate: $endDate})
      RETURN e
    `;

    const params = {
      id: createEventDto.id,
      name: createEventDto.name,
      description: createEventDto.description,
      startDate: createEventDto.startDate,
      endDate: createEventDto.endDate,
    };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const query = `
      MATCH (e:Event {id: $id}) 
      SET e += $update 
      RETURN e
    `;
    const params = { id, update: updateEventDto };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.records.length === 0) {
        throw new NotFoundException('Event not found');
      }
      return result.records[0].get('e').properties;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update event');
    }
  }

  async findAll(): Promise<Event[]> {
    const query = 'MATCH (e:Event) RETURN e';

    try {
      const result = await this.neo4jService.runCypher(query);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch events');
    }
  }

  async findOne(id: string): Promise<Event> {
    const query = 'MATCH (e:Event {id: $id}) RETURN e';
    const params = { id };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.records.length === 0) {
        throw new NotFoundException('Event not found');
      }
      return result.records[0].get('e').properties;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch event');
    }
  }

  async delete(id: string): Promise<void> {
    const query = 'MATCH (e:Event {id: $id}) DELETE e';
    const params = { id };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.summary.counters.updates().nodesDeleted === 0) {
        throw new NotFoundException('Event not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete event');
    }
  }
}
