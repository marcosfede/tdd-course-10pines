import { Cart } from './cart'
import { Book } from './book'
import { Cashier } from './cashier'
import { Catalog } from './catalog'
import { CartIsEmpty, MerchantProcessorError } from '../../exceptions'
import { CreditCard } from './creditcard'
import { MerchantProcessorSimulator } from './merchantProcessor'

const catalog = new Catalog([{ isbn: '123', price: 10 }])
const creditCard = new CreditCard('1234-4321-1234-4321', '03/2022', '123')
const successMP = new MerchantProcessorSimulator((card, amount) => amount)
const offlineMP = new MerchantProcessorSimulator((card, amount) => {
  throw new MerchantProcessorError('Offline')
})
const invalidCreditCardMP = new MerchantProcessorSimulator((card, amount) => {
  throw new MerchantProcessorError('Invalid Credit Card')
})

describe('Cashier', () => {
  beforeEach(() => {})

  it('should throw on checkout for empty cart', async () => {
    const cart = new Cart(catalog)
    const shouldThrow = () => new Cashier(cart, creditCard, successMP)
    expect(shouldThrow).toThrow(CartIsEmpty)
  })

  it('checkouts successfuly', async () => {
    const cart = new Cart(catalog)
    const book = new Book('123')
    cart.addBook(book)
    const cashier = new Cashier(cart, creditCard, successMP)

    const ticket = cashier.checkout()
    expect(ticket.amount).toEqual(10)
  })

  it('throws when MP is offline', async () => {
    const cart = new Cart(catalog)
    const book = new Book('123')
    cart.addBook(book)
    const cashier = new Cashier(cart, creditCard, offlineMP)
    expect(() => cashier.checkout()).toThrow(MerchantProcessorError)
  })

  it('throws when invalid credit card', async () => {
    const cart = new Cart(catalog)
    const book = new Book('123')
    cart.addBook(book)
    const cashier = new Cashier(cart, creditCard, invalidCreditCardMP)
    expect(() => cashier.checkout()).toThrow(MerchantProcessorError)
  })
})
