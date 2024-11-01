// src/person/person.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-user.dto';
import { UpdatePersonDto } from './dto/update-user.dto';

@Controller('persons')
export class PersonController {
  private readonly logger = new Logger(PersonController.name);

  constructor(private readonly personService: PersonService) {}

  @Post()
  async create(@Body() createPersonDto: CreatePersonDto) {
    try {
      const result = await this.personService.create(createPersonDto);
      this.logger.log(`Created person: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error('Error creating person', error);
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.personService.findAll();
      return result;
    } catch (error) {
      this.logger.error('Error fetching all persons', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const person = await this.personService.findOne(id);
      return person;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Person not found');
      }
      this.logger.error('Error finding person', error);
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    try {
      const result = await this.personService.update(id, updatePersonDto);
      this.logger.log(`Updated person: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Person not found');
      }
      this.logger.error('Error updating person', error);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    try {
      await this.personService.delete(id);
      this.logger.log(`Deleted person with id: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Person not found');
      }
      this.logger.error('Error deleting person', error);
      throw error;
    }
  }
}
