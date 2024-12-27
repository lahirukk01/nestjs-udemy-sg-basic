import { DataSource } from 'typeorm';

console.log('Loading ormconfig for NODE_ENV:', process.env.NODE_ENV);

const dbConfig: any = {
  synchronize: false,
  migrationsRun: true,
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    if (
      process.argv[1].includes('cli') ||
      process.argv[1].includes('typeorm')
    ) {
      // Running typeorm cli. TS files are needed
      dbConfig.migrations = ['migrations/*.ts'];
    } else {
      // Nest running. JS files are needed
      dbConfig.migrations = ['migrations/*.js'];
    }
    dbConfig.type = 'sqlite';
    dbConfig.database = 'database.sqlite';
    dbConfig.entities = ['**/*.entity.js'];
    break;
  case 'test':
    dbConfig.type = 'sqlite';
    dbConfig.database = 'test.sqlite';
    dbConfig.entities = ['**/*.entity.ts'];
    dbConfig.migrations = ['migrations/*.ts'];
    break;
  case 'production':
    dbConfig.type = 'postgres';
    dbConfig.url = process.env.DATABASE_URL;
    dbConfig.entities = ['**/*.entity.js'];
    dbConfig.migrations = ['migrations/*.js'];
    break;
  default:
    throw new Error('Unknown environment');
}

export default new DataSource(dbConfig);
