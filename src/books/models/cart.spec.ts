import { Cart } from './cart'
import { Book } from './book'
import { BookNotInCatalog, InvalidBookQuantity } from '../../exceptions'
import { Catalog } from './catalog'

const catalog = new Catalog([{ isbn: '123', price: 10 }])

describe('Cart', () => {
  beforeEach(() => {})

  it('create a cart', async () => {
    const cart = new Cart(catalog)
    expect(cart.isEmpty()).toBe(true)
  })

  it('add a book to a cart', async () => {
    const cart = new Cart(catalog)
    const book = new Book('123')
    cart.addBook(book)

    expect(cart.bookQuantity(book)).toEqual(1)
    expect(cart.bookQuantity(new Book('321'))).toEqual(0)
  })

  it('add multiple copies of a book to a cart', async () => {
    const cart = new Cart(catalog)
    const book = new Book('123')
    cart.addBook(book, 10)

    expect(cart.bookQuantity(book)).toEqual(10)
  })

  it('should fail on book not in catalog', async () => {
    const cart = new Cart(catalog)
    const book = new Book('456')
    const addBook = () => cart.addBook(book, 10)
    expect(addBook).toThrow(BookNotInCatalog)
    expect(cart.bookQuantity(book)).toEqual(0)
  })

  it('should fail on invalid quantity', async () => {
    const cart = new Cart(catalog)
    const book = new Book('123')
    const addBook = () => cart.addBook(book, -1)
    expect(addBook).toThrow(InvalidBookQuantity)
    expect(cart.bookQuantity(book)).toEqual(0)
  })

  it('should calculate price correctly', async () => {
    const cart = new Cart(catalog)
    const book = new Book('123')
    cart.addBook(book, 10)
    expect(cart.getTotalPrice()).toEqual(100)
  })
})
