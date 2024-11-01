import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { Neo4jModule } from '../../database/neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
