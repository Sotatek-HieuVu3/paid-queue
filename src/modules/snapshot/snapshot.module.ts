import { Module } from '@nestjs/common';

import { SnapshotService } from './services/snapshot.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SnapshotService],
})
export class SnapshotModule {}
