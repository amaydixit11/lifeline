// src/relationship/relationship.controller.ts

import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get, // Import Get
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { CreateRelatesToDto } from './relates_to/relates_to.dto';
import { CreateMemberOfDto } from './member_of/member_of.dto';
import { CreateInvolvedInDto } from './involved_in/involved_in.dto';

@Controller('relationship')
export class RelationshipController {
  private readonly logger = new Logger(RelationshipController.name);

  constructor(private readonly relationshipService: RelationshipService) {}

  // Create RELATES_TO relationship
  @Post('relates-to/:fromId/:toId')
  async createRelatesTo(
    @Param('fromId') fromId: string,
    @Param('toId') toId: string,
    @Body() createRelatesToDto: CreateRelatesToDto,
  ) {
    this.logger.log(`Creating RELATES_TO from ${fromId} to ${toId}`);
    try {
      return await this.relationshipService.createRelatesTo(
        createRelatesToDto,
        fromId,
        toId,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create RELATES_TO from ${fromId} to ${toId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create RELATES_TO relationship',
      );
    }
  }

  // Create MEMBER_OF relationship
  @Post('member-of/:userId/:groupId')
  async createMemberOf(
    @Param('userId') userId: string,
    @Param('groupId') groupId: string,
    @Body() createMemberOfDto: CreateMemberOfDto,
  ) {
    this.logger.log(
      `Creating MEMBER_OF relationship for user ${userId} in group ${groupId}`,
    );
    try {
      return await this.relationshipService.createMemberOf(
        createMemberOfDto,
        userId,
        groupId,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create MEMBER_OF for user ${userId} in group ${groupId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create MEMBER_OF relationship',
      );
    }
  }

  // Create INVOLVED_IN relationship
  @Post('involved-in/:userId/:eventId')
  async createInvolvedIn(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
    @Body() createInvolvedInDto: CreateInvolvedInDto,
  ) {
    this.logger.log(
      `Creating INVOLVED_IN relationship for user ${userId} in event ${eventId}`,
    );
    try {
      return await this.relationshipService.createInvolvedIn(
        createInvolvedInDto,
        userId,
        eventId,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create INVOLVED_IN for user ${userId} in event ${eventId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create INVOLVED_IN relationship',
      );
    }
  }

  // Update RELATES_TO relationship
  @Put('relates-to/:fromId/:toId')
  async updateRelatesTo(
    @Param('fromId') fromId: string,
    @Param('toId') toId: string,
    @Body() updateDto: CreateRelatesToDto,
  ) {
    this.logger.log(`Updating RELATES_TO from ${fromId} to ${toId}`);
    try {
      return await this.relationshipService.updateRelatesTo(
        fromId,
        toId,
        updateDto,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update RELATES_TO from ${fromId} to ${toId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update RELATES_TO relationship',
      );
    }
  }

  // Update MEMBER_OF relationship
  @Put('member-of/:userId/:groupId')
  async updateMemberOf(
    @Param('userId') userId: string,
    @Param('groupId') groupId: string,
    @Body() updateDto: CreateMemberOfDto,
  ) {
    this.logger.log(
      `Updating MEMBER_OF relationship for user ${userId} in group ${groupId}`,
    );
    try {
      return await this.relationshipService.updateMemberOf(
        userId,
        groupId,
        updateDto,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update MEMBER_OF for user ${userId} in group ${groupId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update MEMBER_OF relationship',
      );
    }
  }

  // Update INVOLVED_IN relationship
  @Put('involved-in/:userId/:eventId')
  async updateInvolvedIn(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
    @Body() updateDto: CreateInvolvedInDto,
  ) {
    this.logger.log(
      `Updating INVOLVED_IN relationship for user ${userId} in event ${eventId}`,
    );
    try {
      return await this.relationshipService.updateInvolvedIn(
        userId,
        eventId,
        updateDto,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update INVOLVED_IN for user ${userId} in event ${eventId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update INVOLVED_IN relationship',
      );
    }
  }

  // Delete RELATES_TO relationship
  @Delete('relates-to/:fromId/:toId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRelatesTo(
    @Param('fromId') fromId: string,
    @Param('toId') toId: string,
  ) {
    this.logger.log(`Deleting RELATES_TO from ${fromId} to ${toId}`);
    try {
      await this.relationshipService.deleteRelatesTo(fromId, toId);
    } catch (error) {
      this.logger.error(
        `Failed to delete RELATES_TO from ${fromId} to ${toId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to delete RELATES_TO relationship',
      );
    }
  }

  // Delete MEMBER_OF relationship
  @Delete('member-of/:userId/:groupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMemberOf(
    @Param('userId') userId: string,
    @Param('groupId') groupId: string,
  ) {
    this.logger.log(
      `Deleting MEMBER_OF relationship for user ${userId} in group ${groupId}`,
    );
    try {
      await this.relationshipService.deleteMemberOf(userId, groupId);
    } catch (error) {
      this.logger.error(
        `Failed to delete MEMBER_OF for user ${userId} in group ${groupId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to delete MEMBER_OF relationship',
      );
    }
  }

  // Delete INVOLVED_IN relationship
  @Delete('involved-in/:userId/:eventId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInvolvedIn(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
  ) {
    this.logger.log(
      `Deleting INVOLVED_IN relationship for user ${userId} in event ${eventId}`,
    );
    try {
      await this.relationshipService.deleteInvolvedIn(userId, eventId);
    } catch (error) {
      this.logger.error(
        `Failed to delete INVOLVED_IN for user ${userId} in event ${eventId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to delete INVOLVED_IN relationship',
      );
    }
  }

  // Get RELATES_TO relationship
  @Get('relates-to/:fromId/:toId')
  async getRelatesTo(
    @Param('fromId') fromId: string,
    @Param('toId') toId: string,
  ) {
    this.logger.log(`Retrieving RELATES_TO from ${fromId} to ${toId}`);
    try {
      return await this.relationshipService.getRelatesTo(fromId, toId);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve RELATES_TO from ${fromId} to ${toId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve RELATES_TO relationship',
      );
    }
  }
  @Get('relates-to/')
  async getAllRelatesTo() {
    this.logger.log(`Retrieving all RELATES_TO relationships`);
    try {
      return await this.relationshipService.getAllRelatesTo();
    } catch (error) {
      this.logger.error(
        `Failed to retrieve RELATES_TO relationships`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve RELATES_TO relationships',
      );
    }
  }

  // Get MEMBER_OF relationship
  @Get('member-of/:userId/:groupId')
  async getMemberOf(
    @Param('userId') userId: string,
    @Param('groupId') groupId: string,
  ) {
    this.logger.log(
      `Retrieving MEMBER_OF relationship for user ${userId} in group ${groupId}`,
    );
    try {
      return await this.relationshipService.getMemberOf(userId, groupId);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve MEMBER_OF for user ${userId} in group ${groupId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve MEMBER_OF relationship',
      );
    }
  }
  @Get('member-of/')
  async getAllMemberOf() {
    this.logger.log(`Retrieving all MEMBER_OF relationships`);
    try {
      return await this.relationshipService.getAllMemberOf();
    } catch (error) {
      this.logger.error(
        `Failed to retrieve MEMBER_OF relationships`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve MEMBER_OF relationships',
      );
    }
  }

  // Get INVOLVED_IN relationship
  @Get('involved-in/:userId/:eventId')
  async getInvolvedIn(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
  ) {
    this.logger.log(
      `Retrieving INVOLVED_IN relationship for user ${userId} in event ${eventId}`,
    );
    try {
      return await this.relationshipService.getInvolvedIn(userId, eventId);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve INVOLVED_IN for user ${userId} in event ${eventId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve INVOLVED_IN relationship',
      );
    }
  }
  @Get('involved-in/')
  async getAllInvolvedIn() {
    this.logger.log(`Retrieving all INVOLVED_IN relationships`);
    try {
      return await this.relationshipService.getAllInvolvedIn();
    } catch (error) {
      this.logger.error(
        `Failed to retrieve INVOLVED_IN relationships`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve INVOLVED_IN relationships',
      );
    }
  }
}
