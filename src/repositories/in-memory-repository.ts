import * as BigNumber from 'bignumber.js';
import { Repository } from './repository';
import {
  TokenPair,
  OrderbookOrder,
  OrderState,
  ApiFeePayload,
  ApiFeeResponse,
  SignedOrder,
  ApiOrderOptions,
} from '../types/0x-spec';

export interface InMemoryDatabase {
  orderbook: Array<OrderbookOrder>;
}

export class InMemoryRepository implements Repository {
  private db: InMemoryDatabase;

  constructor(initialDb?: InMemoryDatabase) {
    this.db = {
      ...initialDb,
      orderbook: [],
    };
  }

  async postOrder(signedOrder: SignedOrder): Promise<boolean> {
    // missing pending field but i'm not sure what to do with that? docs are sparse
    const fullOrder: OrderbookOrder = {
      signedOrder,
      state: OrderState.OPEN,
      remainingTakerTokenAmount: signedOrder.makerTokenAmount,
    };
    this.db.orderbook.push(fullOrder);
    console.log(
      'order added',
      'logging all orders',
      JSON.stringify(this.db.orderbook)
    );
    return true;
  }

  async getOrders(
    options?: ApiOrderOptions | undefined
  ): Promise<OrderbookOrder[]> {
    const orders = this.db.orderbook.filter(x => x.state === OrderState.OPEN);
    console.log('got orders', orders);
    return orders;
  }

  getTokenPairs(): Promise<TokenPair[]> {
    throw new Error('Method not implemented.');
  }

  getOrder(orderHash: string): Promise<OrderbookOrder> {
    throw new Error('Method not implemented.');
  }
  getFees(feePayload: ApiFeePayload): Promise<ApiFeeResponse> {
    throw new Error('Method not implemented.');
  }
}