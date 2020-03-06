import { Cart } from './cart'
import { CartIsEmpty } from '../../exceptions'
import { CreditCard } from './creditcard'
import { MerchantProcessor } from './merchantProcessor'

export type Ticket = { amount: number }

export class Cashier {
  constructor(
    private cart: Cart,
    private creditCard: CreditCard,
    private mp: MerchantProcessor,
  ) {
    if (cart.isEmpty()) {
      throw new CartIsEmpty('Cart must not be empty')
    }
    this.cart = cart
  }

  checkout(): Ticket {
    const totalAmount = this.cart.getTotalPrice()
    return { amount: this.mp.debit(this.creditCard, totalAmount) }
  }
}
