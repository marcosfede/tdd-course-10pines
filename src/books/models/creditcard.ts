import { parse, isValid, differenceInMonths } from 'date-fns'
import { InvalidCreditCard } from '../../exceptions'

export class CreditCard {
  constructor(
    private cardnumber: string,
    private expiration: string,
    private pin: string,
  ) {
    this.assertValidExpiration(expiration)

    this.cardnumber = cardnumber
    this.expiration = expiration
    this.pin = pin
  }

  private assertValidExpiration(expiration: string) {
    const now = new Date()
    const exp = parse(expiration, 'MM/yyyy', now)
    if (!isValid(exp)) {
      throw new InvalidCreditCard('Credit card expiration is invalid')
    }
    if (differenceInMonths(exp, now) < 0) {
      throw new InvalidCreditCard('Credit card is expired')
    }
  }
}
