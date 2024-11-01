import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { Neo4jModule } from './database/neo4j/neo4j.module';
import { RelationshipModule } from './modules/relationship/relationship.module';
import { GroupModule } from './modules/group/group.module';
import { EventModule } from './modules/event/event.module';
import { PersonModule } from './modules/user/person.module';
import { Neo4jService } from './database/neo4j/neo4j.service';

@Module({
  imports: [
    PersonModule,
    EventModule,
    GroupModule,
    RelationshipModule,
    Neo4jModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, Neo4jService],
})
export class AppModule {}
