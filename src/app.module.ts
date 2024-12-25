import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import cookieSession from 'cookie-session';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';

type TDbType = 'mysql' | 'postgres' | 'sqlite' | 'mssql';

const shouldSyncDb = !['production', 'staging'].includes(process.env.NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<TDbType>('DB_TYPE'),
        database: configService.get<string>('DB_NAME'),
        // autoLoadEntities: true,
        synchronize: shouldSyncDb,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true }),
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [
            this.configService.get<string>('COOKIE_KEY') ??
              'default_cookie_key',
          ],
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        }),
      )
      .forRoutes('*');
  }
}
