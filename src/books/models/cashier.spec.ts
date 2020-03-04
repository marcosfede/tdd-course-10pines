import { Cart } from './cart'
import { Book } from './book'
import { Cashier } from './cashier'
import { Catalog } from './catalog'
import { CartIsEmpty } from '../../exceptions'
import { CreditCard } from './creditcard'

const catalog = new Catalog([{ isbn: '123', price: 10 }])
const creditCard = new CreditCard('1234-4321-1234-4321', '03/2022', '123')

describe('Cart', () => {
  beforeEach(() => {})

  it('should throw on checkout for empty cart', async () => {
    const cart = new Cart(catalog)
    const shouldThrow = () => new Cashier(cart)
    expect(shouldThrow).toThrow(CartIsEmpty)
  })

  it('checkout', async () => {
    const cart = new Cart(catalog)
    const book = new Book('123')
    cart.addBook(book)
    const cashier = new Cashier(cart)
  })
})
