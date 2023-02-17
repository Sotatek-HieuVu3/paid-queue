import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueHandlerModule } from './modules/queue-handler/queue-handler.module';
import { SnapshotModule } from './modules/snapshot/snapshot.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, QueueHandlerModule, SnapshotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
