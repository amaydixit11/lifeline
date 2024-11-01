import { Module } from '@nestjs/common';
import { RelationshipController } from './relationship.controller';
import { RelationshipService } from './relationship.service';
import { Neo4jModule } from 'src/database/neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule],

  controllers: [RelationshipController],
  providers: [RelationshipService],
})
export class RelationshipModule {}
