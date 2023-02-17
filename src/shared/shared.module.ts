import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import configuration from './configs/configuration';
import { configModuleOptions } from './configs/module-options';
import { DatabaseModule } from './database/database.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AppLoggerModule } from './logger/logger.module';
import { QueueModule } from './queue.module';

@Global()
@Module({
  imports: [
    // ConfigModule.forRoot(configModuleOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [configuration],
    }),
    DatabaseModule,
    AppLoggerModule,
    QueueModule,
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     redis: {
    //       host: configService.get('REDIS_HOST'),
    //       port: Number(configService.get('REDIS_PORT')),
    //       password: configService.get('REDIS_PASSWORD'),
    //     },
    //     defaultJobOptions: {
    //       removeOnComplete: true,
    //       removeOnFail: true,
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  exports: [AppLoggerModule, ConfigModule, DatabaseModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },

    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class SharedModule {}
