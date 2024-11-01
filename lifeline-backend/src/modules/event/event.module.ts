import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Neo4jModule } from 'src/database/neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule],

  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
