import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

import { SnapshotService } from '../snapshot/services/snapshot.service';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { QUEUE } from './constants/queue.constants';
import { QueueProcessor } from './processors/queue-handler.processor';

@Module({
  imports: [
    SharedModule,
    BullModule.registerQueue({
      name: QUEUE.NAME,
    }),
    SnapshotModule,
  ],
  providers: [QueueProcessor, SnapshotService],
})
export class QueueHandlerModule {}
