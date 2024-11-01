// src/relationship/relationship.service.ts

import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Neo4jService } from '../../database/neo4j/neo4j.service';
import { CreateRelatesToDto } from './relates_to/relates_to.dto';
import { CreateMemberOfDto } from './member_of/member_of.dto';
import { CreateInvolvedInDto } from './involved_in/involved_in.dto';

@Injectable()
export class RelationshipService {
  private readonly logger = new Logger(RelationshipService.name); // Initialize logger

  constructor(private readonly neo4jService: Neo4jService) {}

  async createRelatesTo(
    createRelatesToDto: CreateRelatesToDto,
    fromId: string,
    toId: string,
  ) {
    const query = `
      MATCH (a:Person {id: $fromId}), (b:Person {id: $toId})
      CREATE (a)-[r:RELATES_TO {startDate: $startDate, endDate: $endDate, relationship: $relationship, level: $level}]->(b)
      RETURN r
    `;
    const params = {
      fromId,
      toId,
      startDate: createRelatesToDto.startDate,
      endDate: createRelatesToDto.endDate,
      relationship: createRelatesToDto.relationship,
      level: createRelatesToDto.level,
    };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      this.logger.log(
        `Created RELATES_TO relationship from ${fromId} to ${toId}`,
      );
      return result.records[0].get('r').properties;
    } catch (error) {
      this.logger.error(
        'Failed to create RELATES_TO relationship',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create RELATES_TO relationship',
      );
    }
  }

  async createMemberOf(
    createMemberOfDto: CreateMemberOfDto,
    userId: string,
    groupId: string,
  ) {
    const query = `
      MATCH (u:Person {id: $userId}), (g:Group {id: $groupId})
      CREATE (u)-[r:MEMBER_OF {startDate: $startDate, endDate: $endDate}]->(g)
      RETURN r
    `;
    const params = {
      userId,
      groupId,
      startDate: createMemberOfDto.startDate,
      endDate: createMemberOfDto.endDate,
    };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      this.logger.log(
        `Created MEMBER_OF relationship for user ${userId} in group ${groupId}`,
      );
      return result.records[0].get('r').properties;
    } catch (error) {
      this.logger.error('Failed to create MEMBER_OF relationship', error.stack);
      throw new InternalServerErrorException(
        'Failed to create MEMBER_OF relationship',
      );
    }
  }

  async createInvolvedIn(
    createInvolvedInDto: CreateInvolvedInDto,
    userId: string,
    eventId: string,
  ) {
    const query = `
      MATCH (u:Person {id: $userId}), (e:Event {id: $eventId})
      CREATE (u)-[r:INVOLVED_IN {startDate: $startDate, endDate: $endDate, role: $role}]->(e)
      RETURN r
    `;
    const params = {
      userId,
      eventId,
      startDate: createInvolvedInDto.startDate,
      endDate: createInvolvedInDto.endDate,
      role: createInvolvedInDto.role,
    };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      this.logger.log(
        `Created INVOLVED_IN relationship for user ${userId} in event ${eventId}`,
      );
      return result.records[0].get('r').properties;
    } catch (error) {
      this.logger.error(
        'Failed to create INVOLVED_IN relationship',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create INVOLVED_IN relationship',
      );
    }
  }

  async updateRelatesTo(
    fromId: string,
    toId: string,
    updateDto: CreateRelatesToDto,
  ) {
    const query = `
      MATCH (a:Person {id: $fromId})-[r:RELATES_TO]->(b:Person {id: $toId})
      SET r += {startDate: $startDate, endDate: $endDate, relationship: $relationship, level: $level}
      RETURN r
    `;
    const params = {
      fromId,
      toId,
      startDate: updateDto.startDate,
      endDate: updateDto.endDate,
      relationship: updateDto.relationship,
      level: updateDto.level,
    };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      this.logger.log(
        `Updated RELATES_TO relationship from ${fromId} to ${toId}`,
      );
      return result.records[0]?.get('r').properties;
    } catch (error) {
      this.logger.error(
        'Failed to update RELATES_TO relationship',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update RELATES_TO relationship',
      );
    }
  }

  async updateMemberOf(
    userId: string,
    groupId: string,
    updateDto: CreateMemberOfDto,
  ) {
    const query = `
      MATCH (u:Person {id: $userId})-[r:MEMBER_OF]->(g:Group {id: $groupId})
      SET r += {startDate: $startDate, endDate: $endDate}
      RETURN r
    `;
    const params = {
      userId,
      groupId,
      startDate: updateDto.startDate,
      endDate: updateDto.endDate,
    };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      this.logger.log(
        `Updated MEMBER_OF relationship for user ${userId} in group ${groupId}`,
      );
      return result.records[0]?.get('r').properties;
    } catch (error) {
      this.logger.error('Failed to update MEMBER_OF relationship', error.stack);
      throw new InternalServerErrorException(
        'Failed to update MEMBER_OF relationship',
      );
    }
  }

  async updateInvolvedIn(
    userId: string,
    eventId: string,
    updateDto: CreateInvolvedInDto,
  ) {
    const query = `
      MATCH (u:Person {id: $userId})-[r:INVOLVED_IN]->(e:Event {id: $eventId})
      SET r += {startDate: $startDate, endDate: $endDate, role: $role}
      RETURN r
    `;
    const params = {
      userId,
      eventId,
      startDate: updateDto.startDate,
      endDate: updateDto.endDate,
      role: updateDto.role,
    };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      this.logger.log(
        `Updated INVOLVED_IN relationship for user ${userId} in event ${eventId}`,
      );
      return result.records[0]?.get('r').properties;
    } catch (error) {
      this.logger.error(
        'Failed to update INVOLVED_IN relationship',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update INVOLVED_IN relationship',
      );
    }
  }

  // DELETE methods
  async deleteRelatesTo(fromId: string, toId: string) {
    const query = `
      MATCH (a:Person {id: $fromId})-[r:RELATES_TO]->(b:Person {id: $toId})
      DELETE r
    `;
    const params = { fromId, toId };

    try {
      await this.neo4jService.runCypher(query, params);
      this.logger.log(
        `Deleted RELATES_TO relationships from ${fromId} to ${toId}`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to delete RELATES_TO relationship',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to delete RELATES_TO relationship',
      );
    }
  }

  async deleteMemberOf(userId: string, groupId: string) {
    const query = `
      MATCH (u:Person {id: $userId})-[r:MEMBER_OF]->(g:Group {id: $groupId})
      DELETE r
    `;
    const params = { userId, groupId };

    try {
      await this.neo4jService.runCypher(query, params);
      this.logger.log(
        `Deleted MEMBER_OF relationship for user ${userId} in group ${groupId}`,
      );
    } catch (error) {
      this.logger.error('Failed to delete MEMBER_OF relationship', error.stack);
      throw new InternalServerErrorException(
        'Failed to delete MEMBER_OF relationship',
      );
    }
  }

  async deleteInvolvedIn(userId: string, eventId: string) {
    const query = `
      MATCH (u:Person {id: $userId})-[r:INVOLVED_IN]->(e:Event {id: $eventId})
      DELETE r
    `;
    const params = { userId, eventId };

    try {
      await this.neo4jService.runCypher(query, params);
      this.logger.log(
        `Deleted INVOLVED_IN relationship for user ${userId} in event ${eventId}`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to delete INVOLVED_IN relationship',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to delete INVOLVED_IN relationship',
      );
    }
  }

  async getRelatesTo(fromId: string, toId: string) {
    const query = `
      MATCH (a:Person {id: $fromId})-[r:RELATES_TO]->(b:Person {id: $toId})
      RETURN r
    `;
    const params = { fromId, toId };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.records.length > 0) {
        this.logger.log(
          `Retrieved RELATES_TO relationship from ${fromId} to ${toId}`,
        );
        return result.records[0].get('r').properties;
      } else {
        this.logger.warn(
          `No RELATES_TO relationship found from ${fromId} to ${toId}`,
        );
        return null; // or throw an exception
      }
    } catch (error) {
      this.logger.error(
        'Failed to retrieve RELATES_TO relationship',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve RELATES_TO relationship',
      );
    }
  }
  async getAllRelatesTo() {
    const query = `
      MATCH (a:Person)-[r:RELATES_TO]->(b:Person)
      RETURN a, b, r
    `;

    try {
      const result = await this.neo4jService.runCypher(query);
      this.logger.log(`Neo4j query result: ${JSON.stringify(result)}`);

      if (result && result.length > 0) {
        this.logger.log(`Retrieved all RELATES_TO relationships`);
        this.logger.log(`Results: ${JSON.stringify(result)}`);
        result.forEach((rel) => {
          const startNode = rel.a.properties;
          const endNode = rel.b.properties;
          const relationship = rel.r.properties;

          this.logger.log(`Each Result: ${JSON.stringify(rel)}`);
          this.logger.log(
            `Relationship from ${startNode.name} to ${endNode.name}:`,
            relationship,
          );
        });
        return result;
      } else {
        this.logger.warn(`No RELATES_TO relationships found`);
        return []; // Return an empty array if no relationships are found
      }
    } catch (error) {
      this.logger.error(
        'Failed to retrieve RELATES_TO relationships',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve RELATES_TO relationships',
      );
    }
  }

  async getMemberOf(userId: string, groupId: string) {
    const query = `
      MATCH (u:Person {id: $userId})-[r:MEMBER_OF]->(g:Group {id: $groupId})
      RETURN r
    `;
    const params = { userId, groupId };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.records.length > 0) {
        this.logger.log(
          `Retrieved MEMBER_OF relationship for user ${userId} in group ${groupId}`,
        );
        return result.records[0].get('r').properties;
      } else {
        this.logger.warn(
          `No MEMBER_OF relationship found for user ${userId} in group ${groupId}`,
        );
        return null; // or throw an exception
      }
    } catch (error) {
      this.logger.error(
        'Failed to retrieve MEMBER_OF relationship',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve MEMBER_OF relationship',
      );
    }
  }

  async getInvolvedIn(userId: string, eventId: string) {
    const query = `
      MATCH (u:Person {id: $userId})-[r:INVOLVED_IN]->(e:Event {id: $eventId})
      RETURN r
    `;
    const params = { userId, eventId };

    try {
      const result = await this.neo4jService.runCypher(query, params);
      if (result.records.length > 0) {
        this.logger.log(
          `Retrieved INVOLVED_IN relationship for user ${userId} in event ${eventId}`,
        );
        return result.records[0].get('r').properties;
      } else {
        this.logger.warn(
          `No INVOLVED_IN relationship found for user ${userId} in event ${eventId}`,
        );
        return null; // or throw an exception
      }
    } catch (error) {
      this.logger.error(
        'Failed to retrieve INVOLVED_IN relationship',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve INVOLVED_IN relationship',
      );
    }
  }
}
