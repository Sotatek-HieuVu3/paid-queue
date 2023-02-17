/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import BigNumber from 'bignumber.js';
import Web3 from 'web3';

export class Web3Helper {
  web3: Web3;
  constructor(providerUrl?: string) {
    if (providerUrl) {
      const web3 = new Web3();
      const provider = providerUrl?.startsWith('ws')
        ? new Web3.providers.WebsocketProvider(providerUrl)
        : new Web3.providers.HttpProvider(providerUrl);

      web3.setProvider(provider);
      this.web3 = web3;
    }
  }

  verifyWalletAddress(input: {
    address: string;
    message: string;
    signature: string;
  }): boolean {
    const { address, message, signature } = input;

    const web3 = new Web3();
    const recover = web3.eth.accounts.recover(message, signature);
    const recoverConvert = Web3.utils.toChecksumAddress(recover);
    const walletAddress = Web3.utils.toChecksumAddress(address);

    if (recoverConvert && recoverConvert !== walletAddress) {
      throw new Error('Invalid signature!');
    }

    return true;
  }

  async getNonceAndGasValues({
    data,
    fromAddress,
    contractAddress,
  }: {
    data: any;
    fromAddress: string;
    contractAddress?: string;
  }): Promise<{
    status: number;
    nonce?: number;
    gasLimit?: number;
    gasPrice?: string;
    error?: any;
  }> {
    console.log(fromAddress, contractAddress, data);
    try {
      const [nonce, estimatedGas, web3GasPriceStr] = await Promise.all([
        this.web3.eth.getTransactionCount(fromAddress),
        this.web3.eth.estimateGas({
          from: fromAddress,
          ...(data ? { data } : {}),
          ...(contractAddress ? { to: contractAddress } : {}),
        }),
        this.web3.eth.getGasPrice(),
      ]);

      const gasLimit = Math.ceil(estimatedGas * 1.5);
      const gasPrice = Math.round(Number(web3GasPriceStr) * 1.5);
      
      console.debug('estimatedGas', estimatedGas);
      console.debug('web3GasPrice: ', gasPrice);
      console.debug('nonce', nonce);

      return {
        status: 1,
        nonce,
        gasLimit,
        gasPrice: gasPrice.toString(),
      };
    } catch (error) {
      console.error('[getNonceAndGasValues] error', error);
      return {
        status: 0,
        error,
      };
    }
  }

  async signTransaction(rawTransaction: any, privateKey: string): Promise<any> {
    const signedTransaction = await this.web3.eth.accounts.signTransaction(
      rawTransaction,
      privateKey,
    );

    return signedTransaction;
  }

  async sendSignedTransaction(
    signedTransaction: any,
    callback?: (error: any, hash: string) => void,
  ): Promise<any> {
    const transactionHash = await this.web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
      callback,
    );

    return transactionHash;
  }

  async getTransactionReceipt(txHash: string): Promise<any> {
    return this.web3.eth.getTransactionReceipt(txHash);
  }

  async getGasPrice(): Promise<number> {
    const gasPrice = await this.web3.eth.getGasPrice();
    return Number(gasPrice);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getTransactionFee(receipt: any): Promise<string> {
    let gasPrice: BigNumber;

    if ((receipt as any)?.effectiveGasPrice) {
      gasPrice = new BigNumber((receipt as any).effectiveGasPrice, 16);
    } else {
      gasPrice = new BigNumber(await this.getGasPrice());
    }

    let transactionFee = gasPrice.multipliedBy(new BigNumber(receipt.gasUsed));
    transactionFee = transactionFee.multipliedBy(new BigNumber(10).pow(-18));

    return transactionFee.toString();
  }
}
