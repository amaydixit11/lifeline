// src/event/event.controller.ts
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
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventController {
  private readonly logger = new Logger(EventController.name);

  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    try {
      const event = await this.eventService.create(createEventDto);
      this.logger.log(`Created event: ${JSON.stringify(event)}`);
      return event;
    } catch (error) {
      this.logger.error('Error creating event', error);
      throw new InternalServerErrorException('Could not create event');
    }
  }

  @Get()
  async findAll() {
    try {
      const events = await this.eventService.findAll();
      this.logger.log('Fetched all events');
      return events;
    } catch (error) {
      this.logger.error('Error fetching events', error);
      throw new InternalServerErrorException('Could not fetch events');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const event = await this.eventService.findOne(id);
      this.logger.log(`Fetched event with id: ${id}`);
      return event;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Event not found');
      }
      this.logger.error('Error fetching event', error);
      throw new InternalServerErrorException('Could not fetch event');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    try {
      const event = await this.eventService.update(id, updateEventDto);
      this.logger.log(`Updated event with id: ${id}`);
      return event;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Event not found');
      }
      this.logger.error('Error updating event', error);
      throw new InternalServerErrorException('Could not update event');
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    try {
      await this.eventService.delete(id);
      this.logger.log(`Deleted event with id: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Event not found');
      }
      this.logger.error('Error deleting event', error);
      throw new InternalServerErrorException('Could not delete event');
    }
  }
}
