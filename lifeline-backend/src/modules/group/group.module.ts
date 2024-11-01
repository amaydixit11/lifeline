import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Neo4jModule } from 'src/database/neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule],

  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
