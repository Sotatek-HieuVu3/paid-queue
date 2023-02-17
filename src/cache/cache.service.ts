import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { parseJson } from '../shared/helpers/utils.helper';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async get(key: string): Promise<Record<string, unknown> | null> {
    const data = await this.cache.get(key);
    return parseJson(data as any);
  }

  async set(key: string, value: string): Promise<void> {
    await this.cache.set(key, value);
  }

}
