import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import cookieSession from 'cookie-session';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { AuthGuard } from './guards/auth.guard';
// import { CurrentUserMiddleware } from './middleware/current-user.middleware';

type TDatabase = 'mysql' | 'postgres' | 'sqlite' | 'mssql';

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
        type: configService.get<TDatabase>('DB_TYPE'),
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
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
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
        // CurrentUserMiddleware,
      )
      .forRoutes('*');
  }
}
