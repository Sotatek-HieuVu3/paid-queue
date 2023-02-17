import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SnapshotProof,
  SnapshotProofSchema,
} from '@paidnetwork/ignition-models-dev';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_CONNECTION_STRING'),
      }),
    }),
    MongooseModule.forFeature([
      { name: SnapshotProof.name, schema: SnapshotProofSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
