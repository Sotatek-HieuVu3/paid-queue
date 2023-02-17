import { CacheModule as NestCacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { SharedModule } from 'src/shared/shared.module';

import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    SharedModule,
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isCacheEnable = configService.get<boolean>('cache.enable');
        if (!isCacheEnable) {
          return {
            ttl: configService.get<number>('cache.ttl'),
          };
        }

        return {
          store: redisStore,
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
