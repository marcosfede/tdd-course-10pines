import { v4 as uuidv4 } from 'uuid'
import { MerchantProcessor } from './merchantProcessor'
import { Catalog } from './catalog'
import { Cart } from './cart'
import {
  InvalidUserError,
  InvalidCartError,
  SessionTimedOutError,
} from '../../exceptions'
import { Book } from './book'
import { CreditCard } from './creditcard'
import { Cashier, Ticket } from './cashier'
import { Clock } from './clock'
import { differenceInMinutes } from 'date-fns'

interface User {
  userId: string
  password: string
}
interface ApplicationInput {
  userStore: User[]
  merchantProcessor: MerchantProcessor
  catalog: Catalog
  clock: Clock
}

export class Application {
  private userStore: User[]
  private cartStore: {
    [id: string]: {
      cart: Cart
      userId: string
      ticket?: Ticket | null
      lastAction?: Date | null
    }
  }
  private merchantProcessor: MerchantProcessor
  private catalog: Catalog
  private clock: Clock

  constructor({
    userStore,
    merchantProcessor,
    catalog,
    clock,
  }: ApplicationInput) {
    this.userStore = userStore
    this.cartStore = {}
    this.merchantProcessor = merchantProcessor
    this.catalog = catalog
    this.clock = clock
  }

  private assertCartIsValid(cartId) {
    if (!this.cartStore.hasOwnProperty(cartId)) {
      throw new InvalidCartError('Cart does not exist')
    }
  }

  private assertUserIsValid(userId, password) {
    if (!this.isValidUser(userId, password)) {
      throw new InvalidUserError('Invalid user')
    }
  }

  private assertCartHasNotExpired(cartId) {
    if (
      differenceInMinutes(
        this.clock.getTime(),
        this.cartStore[cartId].lastAction,
      ) > 30
    ) {
      throw new SessionTimedOutError('Cart has expired')
    }
  }

  private updateCartTimeout(cartId) {
    this.assertCartHasNotExpired(cartId)
    this.cartStore[cartId].lastAction = new Date()
  }

  public isValidUser(userId: string, password: string) {
    return this.userStore.some(
      u => u.userId === userId && u.password === password,
    )
  }

  public createCart(userId: string, password: string) {
    this.assertUserIsValid(userId, password)
    const cart = new Cart(this.catalog)
    const id = uuidv4()
    this.cartStore[id] = { userId: userId, cart: cart }
    this.updateCartTimeout(id)
    return id
  }

  public addToCart(cartId: string, isbn: string, quantity: number) {
    this.assertCartIsValid(cartId)
    const cart = this.cartStore[cartId].cart
    cart.addBook(new Book(isbn), quantity)
    this.updateCartTimeout(cartId)
  }

  public listCart(cartId: string): { [isbn: string]: number } {
    this.assertCartIsValid(cartId)
    this.updateCartTimeout(cartId)
    const cart = this.cartStore[cartId].cart
    const items = cart.getItems()
    return items
  }

  public checkoutCart(
    cartId: string,
    creditCartNumber: string,
    expiration: string,
    pin: string,
  ): Ticket {
    this.assertCartIsValid(cartId)
    this.updateCartTimeout(cartId)
    const creditCard = new CreditCard(creditCartNumber, expiration, pin)
    const cart = this.cartStore[cartId].cart
    const cashier = new Cashier(cart, creditCard, this.merchantProcessor)
    const ticket = cashier.checkout()
    this.cartStore[cartId].ticket = ticket
    return ticket
  }

  public listPurchases(userId: string, password: string): Ticket[] {
    this.assertUserIsValid(userId, password)
    const purchases = Object.values(this.cartStore).filter(
      s => s.userId === userId,
    )
    return purchases.map(p => p.ticket)
  }
}
