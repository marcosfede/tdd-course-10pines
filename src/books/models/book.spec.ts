import { Book } from './book'

describe('Book', () => {
  beforeEach(() => {})

  it('create a book', async () => {
    const cart = new Book('123')
    expect(cart.isbn).toEqual('123')
  })
})
