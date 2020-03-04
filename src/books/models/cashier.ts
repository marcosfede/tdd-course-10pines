import { Cart } from './cart'
import { Catalog } from './catalog'
import { CartIsEmpty } from '../../exceptions'
import { CreditCard } from './creditcard'

export class Cashier {
  constructor(
    private cart: Cart,
  ) {
    if (cart.isEmpty()) {
      throw new CartIsEmpty('Cart must not be empty')
    }
    this.cart = cart
  }

  checkout(creditCard: CreditCard) {
    const totalAmount = this.cart.getTotalPrice()
    return totalAmount
  }
}
