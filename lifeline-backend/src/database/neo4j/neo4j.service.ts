import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Driver,
  Session,
  auth,
  driver,
  QueryResult,
  Record,
} from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleDestroy {
  private driver: Driver;
  private logger = new Logger(Neo4jService.name);

  constructor(private readonly configService: ConfigService) {
    this.initializeDriver();
  }

  private initializeDriver() {
    const uri = this.configService.get<string>('NEO4J_URI');
    const user = this.configService.get<string>('NEO4J_USERNAME');
    const password = this.configService.get<string>('NEO4J_PASSWORD');

    if (!uri || !user || !password) {
      throw new Error('Neo4j configuration is missing.');
    }

    try {
      this.driver = driver(uri, auth.basic(user, password));
      this.logger.log(
        `Neo4j driver initialized successfully. Connecting to ${uri}`,
      );
    } catch (error) {
      this.logger.error('Error initializing Neo4j driver', error);
      throw new Error('Failed to initialize Neo4j driver');
    }
  }

  async runCypher(query: string, params: any = {}): Promise<any> {
    const session: Session = this.driver.session();
    try {
      const result: QueryResult = await session.run(query, params);
      return result.records.map((record: Record) => record.toObject());
    } catch (error) {
      this.logger.error(`Error executing query: ${query}`, error);
      throw new Error(`Query execution failed: ${error.message}`);
    } finally {
      await session.close();
    }
  }

  async getActiveDatabase(): Promise<string> {
    try {
      const result = await this.runCypher('CALL db.info()');
      if (result.length > 0 && result[0]['database']) {
        return result[0]['database'];
      }
      return 'No active database found.';
    } catch (error) {
      this.logger.error('Error retrieving active database', error);
      return 'Error retrieving database';
    }
  }

  async close() {
    try {
      await this.driver.close();
      this.logger.log('Neo4j driver closed successfully.');
    } catch (error) {
      this.logger.error('Error closing Neo4j driver', error);
    }
  }

  async checkConnection(): Promise<boolean> {
    const session: Session = this.driver.session();
    try {
      await session.run('RETURN 1'); // Simple query to check connection
      return true;
    } catch (error) {
      this.logger.error('Neo4j connection check failed', error);
      return false;
    } finally {
      await session.close();
    }
  }

  onModuleDestroy() {
    this.close();
  }
}
