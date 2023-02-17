import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Project,
  SnapshotProof,
  SnapshotProofDocument,
} from '@paidnetwork/ignition-models-dev';
import {
  hexlify,
  keccak256,
  solidityKeccak256,
  solidityPack,
} from 'ethers/lib/utils';
import MerkleTree from 'merkletreejs';
import { Model } from 'mongoose';

import { PoolType } from '../constants/pool-type.constant';
import { MerkleTreeLeafInterface } from '../interfaces/merkle-tree-leaf.interface';

const WHALE_HASH =
  '0xed4b80c86c7954bdbf516c492acb4a2899eb0ee85b7c74e26d85e55a07562c95';
const NORMAL_USER_HASH =
  '0x13e31188d81b941f4c541528790db4031bef078b78d364bde6fc2d4e5ad79e01';

@Injectable()
export class SnapshotService {
  constructor(
    @InjectModel(SnapshotProof.name)
    private readonly snapShotProofModel: Model<SnapshotProofDocument>,
  ) {}

  async generateSnapshotProof(
    buyListLeafs: MerkleTreeLeafInterface[],
    leafNodes: [],
    project: Project,
  ): Promise<void> {
    const snapshotProofData = [];
    const buyMerkleTree = new MerkleTree(leafNodes, keccak256, {
      sortPairs: true,
    });
    console.log('START INSERT PROOF FOR PROJECT ID: ', project._id);
    //get proof and create raw db data
    for (let index = 0; index < buyListLeafs.length; index++) {
      const element = buyListLeafs[index];
      const leaf = solidityPack(
        ['address', 'bytes32', 'uint256', 'uint256'],
        [
          element.candidate,
          element.userType,
          element.maxPurchaseWhetherOrNotKYC,
          element.maxPurchaseBaseOnAllocation,
        ],
      );
      const leafNode = solidityKeccak256(['bytes'], [leaf]);
      const proof = buyMerkleTree.getHexProof(leafNode);
      // this.getHexProof(buyMerkleTree, leafNode);

      let poolType;
      if (element.userType == WHALE_HASH) {
        //group X
        if (element.maxPurchaseBaseOnAllocation != '0') {
          poolType = PoolType.GALAXY;
        } else if (element.maxPurchaseBaseOnAllocation == '0') {
          poolType = PoolType.EARLY_ACCESS;
        }
      } else {
        poolType = PoolType.NORMAL_ACCESS;
      }

      const newSnapshotProof = {
        walletAddress: element.candidate,
        project: project,
        poolType: poolType,
        proof: proof,
        maxPurchaseBaseOnAllocation: element.maxPurchaseBaseOnAllocation,
      };
      snapshotProofData.push(newSnapshotProof);
    }
    this.snapShotProofModel.insertMany(snapshotProofData);
    console.debug('FINISH PROOF FOR PROJECT ID: ', project._id);
  }
}
