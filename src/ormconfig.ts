import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export default {
  type: 'postgres',
  host: 'postgres',
  port: parseInt(process.env.POSTGRES_PORT as string, 10) as number,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/**/migration/*.js'],
  migrationsRun: true,
} as DataSourceOptions;
