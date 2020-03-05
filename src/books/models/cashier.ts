import { Cart } from './cart'
import { CartIsEmpty } from '../../exceptions'
import { CreditCard } from './creditcard'
import { MerchantProcessor } from './merchantProcessor'

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

  checkout() {
    const totalAmount = this.cart.getTotalPrice()
    return this.mp.debit(this.creditCard, totalAmount)
  }
}
