export class Application {
  public createCart(clientId: string, password: string) {}
  public addToCart(cartId: string, isbn: string, quantity: number) {}
  public listCart(cartId: string) {}
  public checkoutCart(
    cartId: string,
    creditCartNumber: string,
    expiration: string,
    ccOwner: string,
  ) {}
  public listPurchases(clientId: string, password: string) {}
}
