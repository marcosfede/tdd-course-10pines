import { CreditCard } from './creditcard'
import { InvalidCreditCard } from '../../exceptions'

describe('Cart', () => {
  beforeEach(() => {})

  it('Raise on invalid expiration date format', async () => {
    const shouldFail = () => new CreditCard('1234-4321-1234-4321', '03/20', '123')
    expect(shouldFail).toThrow(InvalidCreditCard)
    const shouldFail2 = () => new CreditCard('1234-4321-1234-4321', '03-2020', '123')
    expect(shouldFail2).toThrow(InvalidCreditCard)
  })
  it('Raise on invalid expiration date', async () => {
    const shouldFail = () => new CreditCard('1234-4321-1234-4321', '03/2000', '123')
    expect(shouldFail).toThrow(InvalidCreditCard)
  })
})
