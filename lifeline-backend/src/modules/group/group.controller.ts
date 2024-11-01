import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
export class GroupController {
  private readonly logger = new Logger(GroupController.name);

  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    this.logger.log('Received request to create a new group');
    try {
      const group = await this.groupService.create(createGroupDto);
      this.logger.log(`Successfully created group: ${JSON.stringify(group)}`);
      return group;
    } catch (error) {
      this.logger.error('Error occurred while creating group', error.stack);
      throw new InternalServerErrorException('Could not create group');
    }
  }

  @Get()
  async findAll() {
    this.logger.log('Received request to fetch all groups');
    try {
      const groups = await this.groupService.findAll();
      this.logger.log(
        `Successfully fetched all groups: ${JSON.stringify(groups)}`,
      );
      return groups;
    } catch (error) {
      this.logger.error(
        'Error occurred while fetching all groups',
        error.stack,
      );
      throw new InternalServerErrorException('Could not fetch groups');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Received request to fetch group with id: ${id}`);
    try {
      const group = await this.groupService.findOne(id);
      this.logger.log(`Successfully fetched group with id: ${id}`);
      return group;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Group with id ${id} not found`);
        throw new NotFoundException('Group not found');
      }
      this.logger.error(
        `Error occurred while fetching group with id: ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Could not fetch group');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    this.logger.log(`Received request to update group with id: ${id}`);
    try {
      const group = await this.groupService.update(id, updateGroupDto);
      this.logger.log(`Successfully updated group with id: ${id}`);
      return group;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Group with id ${id} not found for update`);
        throw new NotFoundException('Group not found');
      }
      this.logger.error(
        `Error occurred while updating group with id: ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Could not update group');
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    this.logger.log(`Received request to delete group with id: ${id}`);
    try {
      await this.groupService.delete(id);
      this.logger.log(`Successfully deleted group with id: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Group with id ${id} not found for deletion`);
        throw new NotFoundException('Group not found');
      }
      this.logger.error(
        `Error occurred while deleting group with id: ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Could not delete group');
    }
  }
}
