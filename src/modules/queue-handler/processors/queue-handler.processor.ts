import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import {
  SnapshotProof,
  SnapshotProofDocument,
} from '@paidnetwork/ignition-models-dev';
import { DoneCallback, Job } from 'bull';
import { Model } from 'mongoose';
import { SnapshotService } from 'src/modules/snapshot/services/snapshot.service';

import { QUEUE } from '../constants/queue.constants';

@Processor(QUEUE.NAME)
export class QueueProcessor {
  constructor(
    @InjectModel(SnapshotProof.name)
    private readonly snapShotProofModel: Model<SnapshotProofDocument>,
    private readonly snapshotService: SnapshotService,
  ) {}

  @Process({
    name: QUEUE.JOB,
  })
  async insertProofHandler(job: Job, done: DoneCallback): Promise<void> {
    console.log('JOB RUN');
    try {
      const { buyListLeafs, leafNodes, project } = job.data;

      await this.snapshotService.generateSnapshotProof(
        buyListLeafs,
        leafNodes,
        project,
      );
      done(null);
    } catch (error) {
      console.error(`[SnapShotHandler] error`, error);
      done(error);
    }
  }
}
