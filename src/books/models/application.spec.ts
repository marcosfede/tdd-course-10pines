import { Application } from './application'
import { Catalog } from './catalog'
import { MerchantProcessorSimulator } from './merchantProcessor'
import {
  SessionTimedOutError,
  InvalidUserError,
  InvalidCartError,
} from '../../exceptions'
import { TestingClock } from './clock'
import { addMinutes } from 'date-fns'

const catalog = new Catalog([{ isbn: 'isbn123', price: 10 }])
const successMP = new MerchantProcessorSimulator((cc, amount) => amount)
const validUser = { userId: 'fede', password: 'fede' }
const userStore = [validUser]
const clock = new TestingClock()

describe('Application', () => {
  beforeEach(() => {})

  it('Should validate a user', async () => {
    const app = new Application({
      userStore,
      merchantProcessor: successMP,
      catalog,
      clock,
    })
    const valid1 = app.isValidUser('fede_fake', 'fede')
    expect(valid1).toBe(false)
    const valid2 = app.isValidUser(validUser.userId, validUser.password)
    expect(valid2).toBe(true)
  })

  it('Should be able to create a cart', async () => {
    const app = new Application({
      userStore,
      merchantProcessor: successMP,
      catalog,
      clock,
    })
    const response = app.createCart(validUser.userId, validUser.password)
    expect(response).toBeTruthy()
  })

  it('Should raise on invalid user', async () => {
    const app = new Application({
      userStore,
      merchantProcessor: successMP,
      catalog,
      clock,
    })
    expect(() => app.createCart('123', '123')).toThrow(InvalidUserError)
  })

  it('Should raise on invalid cart', async () => {
    const app = new Application({
      userStore,
      merchantProcessor: successMP,
      catalog,
      clock,
    })
    expect(() => app.addToCart('invalidCartId', 'isbn123', 3)).toThrow(
      InvalidCartError,
    )
  })

  it('Should add an item to the store', async () => {
    const app = new Application({
      userStore,
      merchantProcessor: successMP,
      catalog,
      clock,
    })
    const cartId = app.createCart(validUser.userId, validUser.password)
    app.addToCart(cartId, 'isbn123', 3)
    expect(app.listCart(cartId)).toHaveProperty('isbn123', 3)
  })

  it('Should list all cart items', async () => {
    const app = new Application({
      userStore,
      merchantProcessor: successMP,
      catalog,
      clock,
    })
    const cartId = app.createCart(validUser.userId, validUser.password)
    app.addToCart(cartId, 'isbn123', 3)
    const cart = app.listCart(cartId)
    expect(Object.keys(cart).length).toEqual(1)
    expect(cart).toHaveProperty('isbn123', 3)
  })

  it('Should check out a cart', async () => {
    const app = new Application({
      userStore,
      merchantProcessor: successMP,
      catalog,
      clock,
    })
    const cartId = app.createCart(validUser.userId, validUser.password)
    app.addToCart(cartId, 'isbn123', 3)
    const ticket = app.checkoutCart(
      cartId,
      '1234-4321-1234-4321',
      '03/2022',
      '123',
    )
    expect(ticket.amount).toEqual(30)
  })

  it('Should display previous purchases', async () => {
    const app = new Application({
      userStore,
      merchantProcessor: successMP,
      catalog,
      clock,
    })
    const cartId = app.createCart(validUser.userId, validUser.password)
    app.addToCart(cartId, 'isbn123', 3)
    const ticket = app.checkoutCart(
      cartId,
      '1234-4321-1234-4321',
      '03/2022',
      '123',
    )
    const purchases = app.listPurchases(validUser.userId, validUser.password)
    expect(purchases.length).toEqual(1)
    const purchase = purchases[0]
    expect(purchase.amount).toEqual(30)
  })

  it('Should fail after 30 mins of not performing any action', async () => {
    const now = new Date()
    const clock = new TestingClock()
    clock.setTime(now)
    const app = new Application({
      userStore,
      merchantProcessor: successMP,
      catalog,
      clock,
    })
    const cartId = app.createCart(validUser.userId, validUser.password)
    app.addToCart(cartId, 'isbn123', 3)

    clock.setTime(addMinutes(now, 31))
    const shouldFail = () =>
      app.checkoutCart(cartId, '1234-4321-1234-4321', '03/2022', '123')

    expect(shouldFail).toThrow(SessionTimedOutError)
  })
})
