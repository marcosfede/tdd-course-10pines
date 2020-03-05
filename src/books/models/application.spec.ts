import { Application } from './application'
import { Cashier } from './cashier'
import { Cart } from './cart'
import { Catalog } from './catalog'
import { CreditCard } from './creditcard'
import { MerchantProcessorSimulator } from './merchantProcessor'

const catalog = new Catalog([{ isbn: '123', price: 10 }])
const creditCard = new CreditCard('1234-4321-1234-4321', '03/2022', '123')
const successMP = new MerchantProcessorSimulator((cc, amount) => amount)
const validUser = { userId: 'fede', password: 'fede' }
const userStore = [validUser]
const cartStore = []

describe('Application', () => {
  beforeEach(() => {})

  it('Should validate a user', async () => {
    const app = new Application(userStore, cartStore, successMP, catalog)
    const valid1 = app.isValidUser('fede_fake', 'fede')
    expect(valid1).toBe(false)
    const valid2 = app.isValidUser(validUser.userId, validUser.password)
    expect(valid2).toBe(true)
  })

  it('Should be able to create a cart', async () => {
    const app = new Application(userStore, cartStore, successMP, catalog)
    const response = app.createCart(validUser.userId, validUser.password)
    expect(response).toBeTruthy()
  })

  it('Should raise on invalid user', async () => {
    const app = new Application(userStore, cartStore, successMP, catalog)
    expect(() => app.createCart('123', '123')).toThrow(InvalidUserError)
  })
})
