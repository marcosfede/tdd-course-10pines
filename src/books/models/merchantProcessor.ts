import { CreditCard } from './creditcard'

export interface MerchantProcessor {
  debit(creditCard: CreditCard, amount: number): number
}

export class MerchantProcessorSimulator implements MerchantProcessor {
  constructor(
    private onDebit: (creditCard: CreditCard, amount: number) => number,
  ) {
    this.onDebit = onDebit
  }

  debit(creditCard: CreditCard, amount: number) {
    return this.onDebit(creditCard, amount)
  }
}
