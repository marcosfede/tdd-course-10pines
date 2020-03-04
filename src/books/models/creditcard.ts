export class CreditCard {
  constructor(
    private cardnumber: string,
    private expiration: string,
    private pin: string,
  ) {
    this.cardnumber = cardnumber
    this.expiration = expiration
    this.pin = pin
  }
}
